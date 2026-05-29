import {
	getCityContent,
	getOtaPage,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listCities,
	listPublicRoomTypesPricing,
	listPublicRoomTypesStructure,
	mergeCanalHotels,
	mergeRoomTypes,
} from "@/lib/ota"
import { resolveRail } from "@/lib/rails"
import { slugify } from "@/lib/slug"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import HotelsClient from "../HotelsClient"
import SearchResultsClient from "../SearchResultsClient"

type PageParams = {
	params: Promise<{ city: string }>
	searchParams: Promise<{ checkIn?: string; checkOut?: string; adults?: string; children?: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { city: citySlug } = await params
	const cityContent = await getCityContent(citySlug)
	if (!cityContent) return {}
	return {
		title: `Hôtels à ${cityContent.name} | Wenagoo`,
		description: cityContent.description.slice(0, 160),
	}
}

export default async function HotelsCityPage({ params, searchParams }: PageParams) {
	const { city: citySlug } = await params
	const sp = await searchParams

	const [cms, structure, pricing, cityContent, cities] = await Promise.all([
		getOtaPage("home"),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
		getCityContent(citySlug),
		listCities(),
	])

	if (!cityContent) notFound()

	const cityNameNormalized = slugify(cityContent.name)
	const hotels = mergeCanalHotels(structure, pricing).filter((h) => slugify(h.city) === cityNameNormalized)

	// Detect search mode (both dates required)
	const isSearchMode = !!(sp.checkIn && sp.checkOut)

	if (isSearchMode) {
		const adults = parseInt(sp.adults || "2", 10) || 2
		const childrenN = parseInt(sp.children || "0", 10) || 0
		const totalGuests = adults + childrenN

		// Pour chaque hôtel : récupère toutes les chambres matchant la capacité (cartes individuelles)
		const perHotel = await Promise.all(
			hotels.map(async (h) => {
				const [s, p] = await Promise.all([
					listPublicRoomTypesStructure(h.hotelId),
					listPublicRoomTypesPricing(h.hotelId),
				])
				return mergeRoomTypes(s, p)
					.filter((r) => r.maxOccupancy >= totalGuests && r.basePrice > 0)
					.map((room) => ({ hotel: h, room }))
			}),
		)
		const rooms = perHotel.flat().sort((a, b) => a.room.basePrice - b.room.basePrice)

		return (
			<SearchResultsClient
				cms={cms}
				cityName={cityContent.name}
				citySlug={citySlug}
				cities={cities}
				rooms={rooms}
				checkIn={sp.checkIn!}
				checkOut={sp.checkOut!}
				adults={adults}
				childrenCount={childrenN}
			/>
		)
	}

	// 1) Rails dynamiques — template global appliqué aux hôtels de cette ville
	//    (édités dans Honelia admin, scope = "city")
	const templateRails = (cms.rails ?? [])
		.filter((r) => r.scope === "city" && r.isPublished)
		.sort((a, b) => a.position - b.position)
		.map((rail) => ({
			id: rail.id,
			title: rail.title,
			subtitle: rail.subtitle ?? null,
			icon: rail.icon ?? null,
			hotels: resolveRail(rail, hotels),
		}))
		.filter((c) => c.hotels.length >= 5 || c.hotels.length === hotels.length)

	// 2) Collections éditoriales propres à la ville (mode manuel, déjà résolues côté Convex)
	const editorialCollections = cityContent.collections ?? []

	const mergedCollections = [...templateRails, ...editorialCollections]

	return (
		<HotelsClient
			cms={cms}
			hotels={hotels}
			cityFilter={cityContent.name}
			cityCollections={mergedCollections}
			cities={cities}
			citySlug={citySlug}
		/>
	)
}
