import {
	getHotelDetail,
	getRoomTypePricing,
	getRoomTypeStructure,
	listPublicRoomTypesStructure,
	matchRoomBySlug,
} from "@/lib/ota"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReserverClient from "./ReserverClient"

type PageParams = {
	params: Promise<{ hotelSlug: string; roomSlug: string }>
	searchParams: Promise<{ checkIn?: string; checkOut?: string; travelers?: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { hotelSlug, roomSlug } = await params
	const hotel = await getHotelDetail(hotelSlug)
	if (!hotel) return {}
	const rooms = await listPublicRoomTypesStructure(hotel.hotel._id)
	const room = matchRoomBySlug(rooms, roomSlug)
	if (!room) return {}
	return {
		title: `Réservation — ${room.name} · ${hotel.hotel.name}`,
		robots: { index: false, follow: false },
	}
}

export default async function ReserverPage({ params, searchParams }: PageParams) {
	const { hotelSlug, roomSlug } = await params
	const sp = await searchParams

	const hotel = await getHotelDetail(hotelSlug)
	if (!hotel) notFound()

	const structureList = await listPublicRoomTypesStructure(hotel.hotel._id)
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

	// Dates par défaut : aujourd'hui et demain
	const today = new Date()
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
	const toISO = (d: Date) => d.toISOString().slice(0, 10)
	const defaultCheckIn = sp.checkIn || toISO(today)
	const defaultCheckOut = sp.checkOut || toISO(tomorrow)
	const defaultTravelers = sp.travelers || "2"

	return (
		<ReserverClient
			hotel={hotel.hotel}
			room={room}
			defaultCheckIn={defaultCheckIn}
			defaultCheckOut={defaultCheckOut}
			defaultTravelers={defaultTravelers}
		/>
	)
}
