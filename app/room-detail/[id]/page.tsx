import { getRoomTypeStructure } from "@/lib/ota"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"

type PageParams = { params: Promise<{ id: string }> }

export default async function LegacyRoomDetailPage({ params }: PageParams) {
	const { id } = await params
	const room = await getRoomTypeStructure(id)
	if (!room) redirect("/hotels")
	redirect(`/chambre/${room.hotelSlug}/${slugify(room.name)}`)
}
