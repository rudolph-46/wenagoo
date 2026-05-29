import {
	getOtaPage,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listCities,
	mergeCanalHotels,
} from "@/lib/ota"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"
import HotelsClient from "./HotelsClient"

type SearchParams = Promise<{ city?: string }>

export default async function HotelsPage({ searchParams }: { searchParams: SearchParams }) {
	const { city } = await searchParams
	// Legacy ?city=X — redirect to canonical /hotels/[city]
	if (city) {
		redirect(`/hotels/${slugify(decodeURIComponent(city))}`)
	}

	const [cms, structure, pricing, cities] = await Promise.all([
		getOtaPage("home"),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
		listCities(),
	])
	const hotels = mergeCanalHotels(structure, pricing)

	// Network-wide editorial rails (computed) — affichées sur la home /hotels
	const MIN_PER_RAIL = 5
	const normalize = (s?: string) => (s ?? "").toLowerCase()
	const allRanked = [...hotels].sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1
		return b.avgRating - a.avgRating
	})
	const padTo = (matches: typeof hotels, min: number): typeof hotels => {
		if (matches.length >= min) return matches
		const ids = new Set(matches.map((h) => h.hotelId))
		const padding = allRanked.filter((h) => !ids.has(h.hotelId)).slice(0, min - matches.length)
		return [...matches, ...padding]
	}
	const networkRails = [
		{
			id: "net-top-rated",
			title: "Les mieux notés du réseau",
			subtitle: "Les adresses qui font la réputation de Wenagoo.",
			icon: "⭐",
			hotels: padTo(
				[...hotels].filter((h) => h.avgRating > 0).sort((a, b) => b.avgRating - a.avgRating).slice(0, MIN_PER_RAIL + 3),
				MIN_PER_RAIL,
			),
		},
		{
			id: "net-premium",
			title: "L'expérience premium",
			subtitle: "Pour un séjour où le confort se remarque dans chaque détail.",
			icon: "🌿",
			hotels: padTo(hotels.filter((h) => h.stars >= 4), MIN_PER_RAIL),
		},
		{
			id: "net-beach",
			title: "Pour un week-end à la plage",
			subtitle: "Kribi, Limbé — l'océan à portée de réservation.",
			icon: "🌊",
			hotels: padTo(
				hotels.filter((h) => ["kribi", "limbe", "limbé"].some((c) => normalize(h.city).includes(c))),
				MIN_PER_RAIL,
			),
		},
		{
			id: "net-culture",
			title: "Découverte culturelle",
			subtitle: "Yaoundé, Foumban — partez à la rencontre du Cameroun.",
			icon: "🎭",
			hotels: padTo(
				hotels.filter((h) => ["yaounde", "yaoundé", "foumban"].some((c) => normalize(h.city).includes(c))),
				MIN_PER_RAIL,
			),
		},
		{
			id: "net-business",
			title: "Court séjour d'affaires",
			subtitle: "Douala, Yaoundé — bien situés, équipés et réactifs.",
			icon: "💼",
			hotels: padTo(
				hotels.filter((h) => ["douala", "yaounde", "yaoundé"].some((c) => normalize(h.city).includes(c))),
				MIN_PER_RAIL,
			),
		},
		{
			id: "net-budget",
			title: "Le réseau à moins de 30 000 XAF",
			subtitle: "Du confort vérifié, à un prix qui ne triche pas.",
			icon: "💰",
			hotels: padTo(
				hotels.filter((h) => h.lowestCanalPrice > 0 && h.lowestCanalPrice <= 30000),
				MIN_PER_RAIL,
			),
		},
	]
		.filter((c) => c.hotels.length >= MIN_PER_RAIL || c.hotels.length === hotels.length)
		.map((c) => ({ ...c, subtitle: c.subtitle ?? null, icon: c.icon ?? null }))

	return (
		<HotelsClient
			cms={cms}
			hotels={hotels}
			cityFilter={null}
			cityCollections={networkRails}
			cities={cities}
			citySlug={null}
		/>
	)
}
