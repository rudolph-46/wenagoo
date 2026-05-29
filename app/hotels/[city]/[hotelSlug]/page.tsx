import {
	getCanalWrapping,
	getCityContent,
	getHotelDetail,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listPublicReviews,
	listPublicRoomTypesPricing,
	listPublicRoomTypesStructure,
	mergeCanalHotels,
	mergeRoomTypes,
} from "@/lib/ota"
import { slugify } from "@/lib/slug"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import HotelDetailClient from "@/app/hotel-detail/[slug]/HotelDetailClient"

type PageParams = { params: Promise<{ city: string; hotelSlug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { hotelSlug } = await params
	const data = await getHotelDetail(hotelSlug)
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
	const { city, hotelSlug } = await params

	const data = await getHotelDetail(hotelSlug)
	if (!data) notFound()

	// Validate hotel city matches URL city — redirect if mismatch
	const expectedCitySlug = slugify(data.hotel.address?.city || "")
	if (expectedCitySlug && expectedCitySlug !== city) {
		redirect(`/hotels/${expectedCitySlug}/${hotelSlug}`)
	}

	// Validate city exists in our CMS
	const cityContent = await getCityContent(city)
	if (!cityContent) notFound()

	const [roomsStructure, roomsPricing, reviews, wrapping, allStructure, allPricing] = await Promise.all([
		listPublicRoomTypesStructure(data.hotel._id),
		listPublicRoomTypesPricing(data.hotel._id),
		listPublicReviews(data.hotel._id, 12),
		getCanalWrapping(hotelSlug),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
	])
	const rooms = mergeRoomTypes(roomsStructure, roomsPricing)
	const similarHotels = mergeCanalHotels(allStructure, allPricing)
		.filter((h) => h.hotelId !== data.hotel._id && slugify(h.city) === city)
		.slice(0, 4)

	return (
		<HotelDetailClient
			data={data}
			rooms={rooms}
			reviews={reviews}
			wrapping={wrapping}
			similarHotels={similarHotels}
			citySlug={city}
		/>
	)
}
