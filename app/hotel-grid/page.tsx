import { getOtaPage, listCanalHotels } from "@/lib/ota"
import HotelGridClient from "./HotelGridClient"

export const revalidate = 60

export default async function HotelGridPage() {
	const [cms, hotels] = await Promise.all([
		getOtaPage("hotel-grid"),
		listCanalHotels(),
	])
	return <HotelGridClient cms={cms} hotels={hotels} />
}
