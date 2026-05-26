import { getRoomTypeDetail } from "@/lib/ota"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import RoomDetailClient from "./RoomDetailClient"

export const revalidate = 60

type PageParams = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { id } = await params
	const room = await getRoomTypeDetail(id)
	if (!room) return {}
	return {
		title: `${room.name} — ${room.hotelName}`,
		description: room.description,
	}
}

export default async function RoomDetailPage({ params }: PageParams) {
	const { id } = await params
	const room = await getRoomTypeDetail(id)
	if (!room) notFound()
	return <RoomDetailClient room={room} />
}
