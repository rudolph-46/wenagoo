import { getCanalWrapping, getHotelDetail, listPublicReviews, listPublicRoomTypes } from "@/lib/ota"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import HotelDetailClient from "./HotelDetailClient"

export const revalidate = 60

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { slug } = await params
	const data = await getHotelDetail(slug)
	if (!data) return {}
	const title = data.content.seo.metaTitle || data.hotel.name
	const description = data.content.seo.metaDescription || data.hotel.description || ""
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: data.content.seo.ogImageUrl ? [data.content.seo.ogImageUrl] : [],
		},
	}
}

export default async function HotelDetailPage({ params }: PageParams) {
	const { slug } = await params
	const data = await getHotelDetail(slug)
	if (!data) notFound()
	const [rooms, reviews, wrapping] = await Promise.all([
		listPublicRoomTypes(data.hotel._id),
		listPublicReviews(data.hotel._id, 12),
		getCanalWrapping(slug),
	])
	return <HotelDetailClient data={data} rooms={rooms} reviews={reviews} wrapping={wrapping} />
}
