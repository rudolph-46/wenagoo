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
	const allCanalHotels = mergeCanalHotels(structure, pricing)
	const hotels = allCanalHotels.filter((h) => slugify(h.city) === cityNameNormalized)

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

	// Auto-rails (computed from hotel data) — prepended to CMS-curated collections.
	// Each rail must show at least MIN_PER_RAIL hotels: we pad with the city's
	// top-rated hotels that aren't already in the rail.
	const NOW = Date.now()
	const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
	const MIN_PER_RAIL = 5
	const normalize = (s?: string) => (s ?? "").toLowerCase()
	const cityRanked = [...hotels].sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1
		return b.avgRating - a.avgRating
	})
	const padTo = (matches: typeof hotels, min: number): typeof hotels => {
		if (matches.length >= min) return matches
		const ids = new Set(matches.map((h) => h.hotelId))
		const padding = cityRanked.filter((h) => !ids.has(h.hotelId)).slice(0, min - matches.length)
		return [...matches, ...padding]
	}
	const autoCollections = [
		{
			id: "auto-akwa",
			title: "Akwa et alentours",
			subtitle: "Cœur commerçant de Douala — restaurants, boutiques, ambiance",
			icon: "🏬",
			hotels: padTo(hotels.filter((h) => normalize(h.street).includes("akwa")), MIN_PER_RAIL),
		},
		{
			id: "auto-bonanjo",
			title: "Bonanjo et le quartier d'affaires",
			subtitle: "Le QG des voyageurs business — accès rapide CBD et ports",
			icon: "🏢",
			hotels: padTo(hotels.filter((h) => normalize(h.street).includes("bonanjo") || normalize(h.street).includes("bonandjo")), MIN_PER_RAIL),
		},
		{
			id: "auto-couple",
			title: "Pour un week-end en couple",
			subtitle: "Adresses romantiques sélectionnées par notre équipe",
			icon: "💑",
			hotels: padTo(cityRanked.slice(0, MIN_PER_RAIL + 1), MIN_PER_RAIL),
		},
		{
			id: "auto-pool",
			title: "Avec piscine",
			subtitle: "Plongez après une journée bien remplie",
			icon: "🏊",
			hotels: padTo(hotels.filter((h) => h.hasPool), MIN_PER_RAIL),
		},
		{
			id: "auto-new",
			title: "Nouveautés sur Wenagoo",
			subtitle: "Hôtels arrivés ces 30 derniers jours",
			icon: "✨",
			hotels: padTo(hotels.filter((h) => h.createdAt && NOW - h.createdAt <= THIRTY_DAYS), MIN_PER_RAIL),
		},
	]
		// Drop rails only if there isn't even enough city inventory to reach the minimum
		.filter((c) => c.hotels.length >= MIN_PER_RAIL || c.hotels.length === hotels.length)
		.map((c) => ({ ...c, subtitle: c.subtitle ?? null, icon: c.icon ?? null }))

	// Editorial rails curated by superadmin (from cityContent.collections) come after the auto ones.
	const mergedCollections = [...autoCollections, ...(cityContent.collections ?? [])]

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
