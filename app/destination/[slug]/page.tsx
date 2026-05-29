import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
	getCityContent,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	mergeCanalHotels,
} from "@/lib/ota"
import DestinationClient from "./DestinationClient"

type PageParams = { params: Promise<{ slug: string }> }

function normalize(s: string): string {
	return s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.trim()
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { slug } = await params
	const city = await getCityContent(slug.toLowerCase())
	if (!city) return { title: "Destination" }
	return {
		title: `Hôtels à ${city.name} | Wenagoo`,
		description: city.description.slice(0, 160),
	}
}

export default async function DestinationPage({ params }: PageParams) {
	const { slug } = await params
	const city = await getCityContent(slug.toLowerCase())
	if (!city) notFound()

	const [structure, pricing] = await Promise.all([
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
	])
	const allHotels = mergeCanalHotels(structure, pricing)
	const needle = normalize(city.name)
	const cityHotels = allHotels.filter((h) => normalize(h.city) === needle)

	return <DestinationClient city={city} cityHotels={cityHotels} />
}
