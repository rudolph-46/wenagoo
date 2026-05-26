import { anyApi } from "convex/server"
import { getConvexClient } from "./convex"

export type OtaPageContent = {
	key: string
	hero: {
		title: string
		subtitle: string
		backgroundImageUrl: string | null
	}
	destinations: Array<{
		label: string
		href: string | null
		imageUrl: string | null
	}>
	filtersLabels: {
		price: string
		type: string
		amenities: string
		roomStyle: string
		reviewScore: string
		location: string
	}
	promoBanner: {
		title: string
		subtitle: string
		imageUrl: string | null
		playStoreUrl: string
		appStoreUrl: string
	}
	footer: {
		address: string
		hours: string
		email: string
		phone: string
		socials: Array<{ platform: string; url: string }>
	}
	updatedAt: number
}

export type CanalHotel = {
	hotelId: string
	slug: string
	name: string
	city: string
	country: string
	stars: number
	avgRating: number
	reviewCount: number
	ratingLabel: string
	coverUrl: string | null
	canalTag: string | null
	featured: boolean
	lowestCanalPrice: number
	discount: number
	enabledRoomTypes: number
	description: string
}

export async function getOtaPage(key: string): Promise<OtaPageContent> {
	const client = getConvexClient()
	return (await client.query(anyApi.otaPage.get, { key })) as OtaPageContent
}

export type NavProduct = {
	code: string
	label: string
	iconName: string | null
}

export async function listNavProducts(): Promise<NavProduct[]> {
	try {
		const client = getConvexClient()
		return (await client.query(anyApi.otaPage.listNavProducts, {})) as NavProduct[]
	} catch {
		return []
	}
}

export async function listCanalHotels(): Promise<CanalHotel[]> {
	const client = getConvexClient()
	return (await client.query(anyApi.canal.listHotelsForApp, {})) as CanalHotel[]
}

export type CanalWrapping = {
	hotelId: string
	hotelSlug: string
	title: string | null
	description: string | null
	tag: string | null
	coverUrl: string | null
	photoUrls: string[]
	faq: Array<{ question: string; answer: string }>
	policies: Array<{ title: string; description: string; icon: string }>
	featured: boolean
	monthlyQuota: number | null
	quotaUsed: number
}

export async function getCanalWrapping(slug: string): Promise<CanalWrapping | null> {
	const client = getConvexClient()
	return (await client.query(anyApi.canal.getCanalWrappingBySlug, { slug })) as CanalWrapping | null
}

export type HotelDetail = {
	hotel: {
		_id: string
		name: string
		slug: string
		description: string | null
		stars: number | null
		address: { city?: string; country?: string; street?: string }
		amenities: string[]
		coverUrl: string | null
		photosUrls: (string | null)[]
	}
	content: {
		welcome: { title?: string; tagline?: string; description?: string }
		highlights: Array<{ title: string; description: string; icon?: string }>
		vision: { title?: string; description?: string; imageUrls: (string | null)[] }
		roomsSection: { title?: string; subtitle?: string }
		videoGallery: {
			title?: string
			items: Array<{
				title: string
				location: string | null
				videoUrl: string
				thumbnailUrl: string | null
			}>
		}
		testimonialsSection: { title?: string; subtitle?: string }
		seo: { metaTitle?: string; metaDescription?: string; ogImageUrl: string | null }
	}
}

export type PublicRoomType = {
	_id: string
	name: string
	description: string
	basePrice: number
	baseOccupancy: number
	maxOccupancy: number
	size: number
	beds: Array<{ type: string; count: number }>
	amenities: string[]
	photoUrl: string | null
	totalRooms: number
}

export type PublicReview = {
	id: string
	rating: number
	title: string
	comment: string
	ratings?: Record<string, number>
	guestName: string
	guestCountry?: string
	response?: string
	respondedAt?: number
	createdAt: number
}

export async function getHotelDetail(slug: string): Promise<HotelDetail | null> {
	const client = getConvexClient()
	return (await client.query(anyApi.otaPage.getHotelDetailBySlug, { slug })) as HotelDetail | null
}

export async function listPublicRoomTypes(hotelId: string): Promise<PublicRoomType[]> {
	const client = getConvexClient()
	return (await client.query(anyApi.roomTypes.listPublic, { hotelId })) as PublicRoomType[]
}

export type RoomTypeDetail = {
	_id: string
	hotelId: string
	hotelSlug: string
	hotelName: string
	name: string
	description: string
	basePrice: number
	basePricePublic?: number
	baseOccupancy: number
	maxOccupancy: number
	size: number
	beds: Array<{ type: string; count: number }>
	amenities: string[]
	highlights: Array<{ title: string; description: string }>
	photoUrls: string[]
	totalRooms: number
	onCanal: boolean
}

export async function getRoomTypeDetail(id: string): Promise<RoomTypeDetail | null> {
	const client = getConvexClient()
	return (await client.query(anyApi.roomTypes.getPublic, { id })) as RoomTypeDetail | null
}

export async function listPublicReviews(hotelId: string, limit = 10): Promise<PublicReview[]> {
	const client = getConvexClient()
	return (await client.query(anyApi.reviews.getPublic, { hotelId, limit })) as PublicReview[]
}
