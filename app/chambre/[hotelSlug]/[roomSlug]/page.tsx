import { getHotelDetail } from "@/lib/ota"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"

type PageParams = { params: Promise<{ hotelSlug: string; roomSlug: string }> }

export default async function LegacyChambrePage({ params }: PageParams) {
	const { hotelSlug, roomSlug } = await params
	const hotel = await getHotelDetail(hotelSlug)
	if (!hotel) redirect("/hotels")
	const city = slugify(hotel.hotel.address?.city || "")
	redirect(city ? `/hotels/${city}/${hotelSlug}/${roomSlug}` : "/hotels")
}
