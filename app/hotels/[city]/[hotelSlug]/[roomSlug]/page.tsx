import {
	getCanalWrapping,
	getHotelDetail,
	getRoomTypePricing,
	getRoomTypeStructure,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	listPublicReviews,
	listPublicRoomTypesPricing,
	listPublicRoomTypesStructure,
	matchRoomBySlug,
	mergeCanalHotels,
	mergeRoomTypes,
} from "@/lib/ota"
import { slugify } from "@/lib/slug"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import RoomDetailClient from "@/app/chambre/[hotelSlug]/[roomSlug]/RoomDetailClient"

type PageParams = { params: Promise<{ city: string; hotelSlug: string; roomSlug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { hotelSlug, roomSlug } = await params
	const hotel = await getHotelDetail(hotelSlug)
	if (!hotel) return {}
	const rooms = await listPublicRoomTypesStructure(hotel.hotel._id)
	const room = matchRoomBySlug(rooms, roomSlug)
	if (!room) return {}
	return {
		title: `${room.name} — ${hotel.hotel.name}`,
		description: room.description,
	}
}

export default async function ChambreDetailPage({ params }: PageParams) {
	const { city, hotelSlug, roomSlug } = await params

	const hotel = await getHotelDetail(hotelSlug)
	if (!hotel) notFound()

	// Validate hotel city matches URL city
	const expectedCitySlug = slugify(hotel.hotel.address?.city || "")
	if (expectedCitySlug && expectedCitySlug !== city) {
		redirect(`/hotels/${expectedCitySlug}/${hotelSlug}/${roomSlug}`)
	}

	const [structureList, pricingList] = await Promise.all([
		listPublicRoomTypesStructure(hotel.hotel._id),
		listPublicRoomTypesPricing(hotel.hotel._id),
	])
	const found = matchRoomBySlug(structureList, roomSlug)
	if (!found) notFound()

	const [fullStructure, fullPricing] = await Promise.all([
		getRoomTypeStructure(found._id),
		getRoomTypePricing(found._id),
	])
	if (!fullStructure) notFound()

	const room = {
		...fullStructure,
		basePrice: fullPricing?.basePrice ?? 0,
		basePricePublic: fullPricing?.basePricePublic ?? 0,
		totalRooms: fullPricing?.totalRooms ?? 0,
	}

	const otherRooms = mergeRoomTypes(structureList, pricingList).filter(
		(r) => r._id !== found._id,
	)

	const [reviews, wrapping, allStructure, allPricing] = await Promise.all([
		listPublicReviews(hotel.hotel._id, 10),
		getCanalWrapping(hotelSlug),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
	])
	const nearbyHotelsAll = mergeCanalHotels(allStructure, allPricing)
		.filter((h) => h.hotelId !== hotel.hotel._id && slugify(h.city) === city)
	const nearbyHotels = nearbyHotelsAll.slice(0, 4)

	// Référence de prix de la chambre courante (±25%)
	const refPrice = room.basePrice || room.basePricePublic || 0

	// "Vous pourriez aussi aimer" — chambres du même hôtel avec un tarif proche
	const similarRooms = refPrice > 0
		? otherRooms
			.filter((r) => r.basePrice > 0 && Math.abs(r.basePrice - refPrice) / refPrice <= 0.25)
			.sort((a, b) => Math.abs(a.basePrice - refPrice) - Math.abs(b.basePrice - refPrice))
			.slice(0, 4)
		: otherRooms.slice(0, 4)

	// Chambres à tarif similaire dans les hôtels à proximité (±25%)
	const nearbyRoomsRaw = await Promise.all(
		nearbyHotelsAll.slice(0, 6).map(async (h) => {
			const [s, p] = await Promise.all([
				listPublicRoomTypesStructure(h.hotelId),
				listPublicRoomTypesPricing(h.hotelId),
			])
			return mergeRoomTypes(s, p).map((r) => ({
				...r,
				hotelName: h.name,
				hotelSlug: h.slug,
				hotelCity: h.city,
			}))
		}),
	)
	const nearbyRooms = (refPrice > 0
		? nearbyRoomsRaw.flat().filter((r) => r.basePrice > 0 && Math.abs(r.basePrice - refPrice) / refPrice <= 0.25)
		: nearbyRoomsRaw.flat())
		.sort((a, b) => Math.abs(a.basePrice - refPrice) - Math.abs(b.basePrice - refPrice))
		.slice(0, 4)

	return (
		<RoomDetailClient
			room={room}
			hotel={hotel.hotel}
			hotelWhatsapp={hotel.content.whatsapp}
			hotelEmail={hotel.content.contactEmail}
			otherRooms={otherRooms}
			similarRooms={similarRooms}
			nearbyRooms={nearbyRooms}
			nearbyHotels={nearbyHotels}
			reviews={reviews}
			faq={wrapping?.faq ?? []}
			citySlug={city}
			hotelSlug={hotelSlug}
			roomSlug={roomSlug}
		/>
	)
}
