import {
	getOtaPage,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listCities,
	mergeCanalHotels,
} from "@/lib/ota"
import { resolveRail } from "@/lib/rails"
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

	// Rails network — entièrement pilotées par le CMS Honelia (otaPageContent.rails)
	const networkRails = (cms.rails ?? [])
		.filter((r) => r.scope === "network" && r.isPublished)
		.sort((a, b) => a.position - b.position)
		.map((rail) => ({
			id: rail.id,
			title: rail.title,
			subtitle: rail.subtitle ?? null,
			icon: rail.icon ?? null,
			hotels: resolveRail(rail, hotels),
		}))
		// On n'affiche pas une rail trop maigre sauf si le réseau global est lui-même petit.
		.filter((c) => c.hotels.length >= 5 || c.hotels.length === hotels.length)

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
