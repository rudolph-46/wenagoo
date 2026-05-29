import {
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listCities,
	mergeCanalHotels,
} from "@/lib/ota"
import { RAILS } from "@/lib/rails-catalog"
import { slugify } from "@/lib/slug"
import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wenagoo.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [cities, structure, pricing] = await Promise.all([
		listCities(),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
	])

	const hotels = mergeCanalHotels(structure, pricing)
	const now = new Date()

	const staticPages: MetadataRoute.Sitemap = [
		{ url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
		{ url: `${BASE_URL}/hotels`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
	]

	const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
		url: `${BASE_URL}/hotels/${c.slug}`,
		lastModified: now,
		changeFrequency: "daily" as const,
		priority: 0.8,
	}))

	// Rail × city pages — main SEO surface
	const railCityPages: MetadataRoute.Sitemap = []
	for (const c of cities) {
		const cityNormalized = slugify(c.name)
		const cityHotels = hotels.filter((h) => slugify(h.city) === cityNormalized)
		for (const rail of RAILS) {
			const matched = rail.matches(cityHotels)
			if (matched.length === 0) continue
			railCityPages.push({
				url: `${BASE_URL}/hotels/${c.slug}/selection/${rail.slug}`,
				lastModified: now,
				changeFrequency: "weekly",
				priority: 0.7,
			})
		}
	}

	// Hotel detail pages
	const hotelPages: MetadataRoute.Sitemap = hotels
		.filter((h) => h.city)
		.map((h) => ({
			url: `${BASE_URL}/hotels/${slugify(h.city)}/${h.slug}`,
			lastModified: now,
			changeFrequency: "weekly" as const,
			priority: 0.6,
		}))

	return [...staticPages, ...cityPages, ...railCityPages, ...hotelPages]
}
