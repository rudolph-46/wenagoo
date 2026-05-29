import { anyApi } from "convex/server"
import { unstable_cache } from "next/cache"
import { getConvexClient } from "./convex"
import type { Rail } from "./rails"
import { slugify } from "./slug"

// In dev mode every cached query is bypassed (revalidate: 1) so CMS edits
// show up on the next request. In prod the production TTLs apply.
const isDev = process.env.NODE_ENV === "development"
const HOUR = isDev ? 1 : 3600
const DAY = isDev ? 1 : 86400
const MINUTE_5 = isDev ? 1 : 300
const MINUTE_15 = isDev ? 1 : 900

export type OtaTopBanner = {
	text: string
	ctaLabel?: string | null
	ctaHref?: string | null
}

export type OtaFooter = {
	address: string
	hours: string
	email: string
	phone: string
	whatsapp: string | null
	socials: Array<{ platform: string; url: string }>
}

export type OtaPaymentMethod = {
	label: string
	imageUrl: string | null
}

export type OtaPageContent = {
	key: string
	topBanner: OtaTopBanner | null
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
	footer: OtaFooter
	paymentMethods: OtaPaymentMethod[]
	rails?: Rail[]
	updatedAt: number
}

export type CanalHotelStructure = {
	hotelId: string
	slug: string
	name: string
	city: string
	country: string
	street?: string
	stars: number
	coverUrl: string | null
	canalTag: string | null
	featured: boolean
	description: string
	hasPool?: boolean
	createdAt?: number
}

export type CanalHotelPricing = {
	hotelId: string
	lowestCanalPrice: number
	discount: number
	enabledRoomTypes: number
	available: boolean
	avgRating: number
	reviewCount: number
	ratingLabel: string
}

export type CanalHotel = CanalHotelStructure &
	Omit<CanalHotelPricing, "hotelId" | "available">

export function mergeCanalHotels(
	structure: CanalHotelStructure[],
	pricing: CanalHotelPricing[],
): CanalHotel[] {
	const byId = new Map(pricing.map((p) => [p.hotelId, p]))
	return structure
		.map((s) => {
			const p = byId.get(s.hotelId)
			if (!p || !p.available) return null
			return {
				...s,
				avgRating: p.avgRating,
				reviewCount: p.reviewCount,
				ratingLabel: p.ratingLabel,
				lowestCanalPrice: p.lowestCanalPrice,
				discount: p.discount,
				enabledRoomTypes: p.enabledRoomTypes,
			} satisfies CanalHotel
		})
		.filter((x): x is CanalHotel => x !== null)
		.sort((a, b) => {
			if (a.featured !== b.featured) return a.featured ? -1 : 1
			return b.avgRating - a.avgRating
		})
}

export function getOtaPage(key: string): Promise<OtaPageContent> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.otaPage.get, { key })) as OtaPageContent
		},
		["ota-page", key],
		{ revalidate: DAY, tags: [`ota-page:${key}`] },
	)()
}

export type NavProduct = {
	code: string
	label: string
	iconName: string | null
}

const fetchNavProducts = unstable_cache(
	async (): Promise<NavProduct[]> => {
		const client = getConvexClient()
		return (await client.query(anyApi.otaPage.listNavProducts, {})) as NavProduct[]
	},
	["nav-products"],
	{ revalidate: DAY, tags: ["nav-products"] },
)

export async function listNavProducts(): Promise<NavProduct[]> {
	try {
		return await fetchNavProducts()
	} catch {
		return []
	}
}

export const listCanalHotelsStructure = unstable_cache(
	async (): Promise<CanalHotelStructure[]> => {
		const client = getConvexClient()
		return (await client.query(anyApi.canal.listHotelsStructureForApp, {})) as CanalHotelStructure[]
	},
	["canal-hotels-structure"],
	{ revalidate: HOUR, tags: ["canal-hotels-structure"] },
)

export const listCanalHotelsPricing = unstable_cache(
	async (): Promise<CanalHotelPricing[]> => {
		const client = getConvexClient()
		return (await client.query(anyApi.canal.listHotelsPricingForApp, {})) as CanalHotelPricing[]
	},
	["canal-hotels-pricing"],
	{ revalidate: MINUTE_5, tags: ["canal-hotels-pricing"] },
)

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

export function getCanalWrapping(slug: string): Promise<CanalWrapping | null> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.canal.getCanalWrappingBySlug, { slug })) as CanalWrapping | null
		},
		["canal-wrapping", slug],
		{ revalidate: DAY, tags: [`canal-wrapping:${slug}`] },
	)()
}

export type HowItWorks = {
	title?: string
	subtitle?: string
	steps: Array<{ title: string; description: string; iconName?: string }>
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
		highlights: Array<{ title: string; description: string; iconName?: string }>
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
		whatsapp: string | null
		contactEmail: string | null
		paymentMethods: OtaPaymentMethod[]
		howItWorks: HowItWorks | null
	}
}

export type PublicRoomTypeStructure = {
	_id: string
	name: string
	aliasNames?: string[]
	description: string
	baseOccupancy: number
	maxOccupancy: number
	size: number
	beds: Array<{ type: string; count: number }>
	amenities: string[]
	photoUrl: string | null
}

export function matchRoomBySlug<T extends { name: string; aliasNames?: string[] }>(
	rooms: T[],
	roomSlug: string,
): T | undefined {
	return rooms.find((r) => {
		const candidates = r.aliasNames && r.aliasNames.length > 0 ? r.aliasNames : [r.name]
		return candidates.some((n) => slugify(n) === roomSlug)
	})
}

export type PublicRoomTypePricing = {
	_id: string
	basePrice: number
	totalRooms: number
}

export type PublicRoomType = PublicRoomTypeStructure & Omit<PublicRoomTypePricing, "_id">

export function mergeRoomTypes(
	structure: PublicRoomTypeStructure[],
	pricing: PublicRoomTypePricing[],
): PublicRoomType[] {
	const byId = new Map(pricing.map((p) => [p._id, p]))
	return structure.map((s) => {
		const p = byId.get(s._id)
		return {
			...s,
			basePrice: p?.basePrice ?? 0,
			totalRooms: p?.totalRooms ?? 0,
		}
	})
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

export function getHotelDetail(slug: string): Promise<HotelDetail | null> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.otaPage.getHotelDetailBySlug, { slug })) as HotelDetail | null
		},
		["hotel-detail", slug],
		{ revalidate: DAY, tags: [`hotel:${slug}`] },
	)()
}

export function listPublicRoomTypesStructure(
	hotelId: string,
): Promise<PublicRoomTypeStructure[]> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.roomTypes.listPublic, { hotelId })) as PublicRoomTypeStructure[]
		},
		["hotel-rooms-structure", hotelId],
		{ revalidate: HOUR, tags: [`hotel-rooms-structure:${hotelId}`] },
	)()
}

export function listPublicRoomTypesPricing(
	hotelId: string,
): Promise<PublicRoomTypePricing[]> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.roomTypes.listPricing, { hotelId })) as PublicRoomTypePricing[]
		},
		["hotel-rooms-pricing", hotelId],
		{ revalidate: MINUTE_5, tags: [`hotel-rooms-pricing:${hotelId}`] },
	)()
}

export type RoomTypeDetailStructure = {
	_id: string
	hotelId: string
	hotelSlug: string
	hotelName: string
	name: string
	description: string
	baseOccupancy: number
	maxOccupancy: number
	size: number
	beds: Array<{ type: string; count: number }>
	amenities: string[]
	highlights: Array<{ title: string; description: string }>
	photoUrls: string[]
	onCanal: boolean
}

export type RoomTypeDetailPricing = {
	_id: string
	basePrice: number
	basePricePublic: number
	totalRooms: number
}

export type RoomTypeDetail = RoomTypeDetailStructure & Omit<RoomTypeDetailPricing, "_id">

export function getRoomTypeStructure(id: string): Promise<RoomTypeDetailStructure | null> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.roomTypes.getPublic, { id })) as RoomTypeDetailStructure | null
		},
		["room-structure", id],
		{ revalidate: HOUR, tags: [`room-structure:${id}`] },
	)()
}

export function getRoomTypePricing(id: string): Promise<RoomTypeDetailPricing | null> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.roomTypes.getPublicPricing, { id })) as RoomTypeDetailPricing | null
		},
		["room-pricing", id],
		{ revalidate: MINUTE_5, tags: [`room-pricing:${id}`] },
	)()
}

export function listPublicReviews(hotelId: string, limit = 10): Promise<PublicReview[]> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.reviews.getPublic, { hotelId, limit })) as PublicReview[]
		},
		["reviews", hotelId, String(limit)],
		{ revalidate: MINUTE_15, tags: [`reviews:${hotelId}`] },
	)()
}

// ============================================
// CITY CONTENT (per-city destination page)
// ============================================

export type CityInfoCard = {
	language: string
	peakSeason: string
	timeZone: string
	currency: string
}

export type CityTopDestination = {
	label: string
	href: string | null
	imageUrl: string | null
}

export type CityCollection = {
	id: string
	title: string
	subtitle: string | null
	icon: string | null
	hotels: CanalHotel[]
}

export type CityContent = {
	slug: string
	name: string
	region: string | null
	description: string
	bannerImageUrls: string[]
	topDestinations: CityTopDestination[]
	infoCard: CityInfoCard
	isPublished: boolean
	isComingSoon: boolean
	collections: CityCollection[]
	updatedAt: number
}

export function getCityContent(slug: string): Promise<CityContent | null> {
	return unstable_cache(
		async () => {
			const client = getConvexClient()
			return (await client.query(anyApi.cityContent.getBySlug, { slug })) as CityContent | null
		},
		["city-content", slug],
		{ revalidate: DAY, tags: [`city:${slug}`] },
	)()
}

export type CitySummary = {
	slug: string
	name: string
	isPublished: boolean
	isComingSoon: boolean
}

export const listCities = unstable_cache(
	async (): Promise<CitySummary[]> => {
		const client = getConvexClient()
		const all = (await client.query(anyApi.cityContent.listSlugs, {})) as CitySummary[]
		return all.filter((c) => c.isPublished && !c.isComingSoon).sort((a, b) => a.name.localeCompare(b.name))
	},
	["cities-list"],
	{ revalidate: DAY, tags: ["cities-list"] },
)
