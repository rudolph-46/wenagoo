import { getHotelDetail } from "@/lib/ota"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"

type PageParams = { params: Promise<{ slug: string }> }

export default async function LegacyHotelDetailPage({ params }: PageParams) {
	const { slug } = await params
	const hotel = await getHotelDetail(slug)
	if (!hotel) redirect("/hotels")
	const city = slugify(hotel.hotel.address?.city || "")
	redirect(city ? `/hotels/${city}/${slug}` : "/hotels")
}
