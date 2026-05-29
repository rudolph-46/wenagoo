import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"

type SearchParams = Promise<{ city?: string }>

export default async function HotelGridLegacyPage({ searchParams }: { searchParams: SearchParams }) {
	const { city } = await searchParams
	if (city) {
		redirect(`/hotels/${slugify(decodeURIComponent(city))}`)
	}
	redirect("/hotels")
}
