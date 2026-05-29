import type { CanalHotel } from "./ota"

export type RailFilter = {
	type:
		| "top_rated"
		| "min_rating"
		| "min_stars"
		| "max_price"
		| "city_includes"
		| "street_includes"
		| "has_pool"
		| "featured"
		| "created_within_days"
	numberValue?: number
	stringValues?: string[]
}

export type Rail = {
	id: string
	scope: "network" | "city"
	title: string
	subtitle?: string | null
	icon?: string | null
	position: number
	isPublished: boolean
	mode?: "filter" | "manual"
	hotelIds?: string[]
	filter: RailFilter
	limit?: number
	minToShow?: number
}

const normalize = (s?: string) => (s ?? "").toLowerCase()

/**
 * Applique le filtre d'une rail à une liste d'hôtels et renvoie le sous-ensemble matché.
 * NB : pour mode === "manual", utiliser plutôt `applyManual` ci-dessous.
 */
export function applyRailFilter(filter: RailFilter, hotels: CanalHotel[]): CanalHotel[] {
	const v = filter.numberValue
	const sv = filter.stringValues ?? []
	switch (filter.type) {
		case "top_rated":
			return [...hotels].sort((a, b) => b.avgRating - a.avgRating)
		case "min_rating":
			return hotels.filter((h) => h.avgRating >= (v ?? 0))
		case "min_stars":
			return hotels.filter((h) => h.stars >= (v ?? 0))
		case "max_price":
			return hotels.filter((h) => h.lowestCanalPrice > 0 && h.lowestCanalPrice <= (v ?? Infinity))
		case "city_includes":
			return hotels.filter((h) => sv.some((kw) => normalize(h.city).includes(normalize(kw))))
		case "street_includes":
			return hotels.filter((h) => sv.some((kw) => normalize(h.street).includes(normalize(kw))))
		case "has_pool":
			return hotels.filter((h) => h.hasPool === true)
		case "featured":
			return hotels.filter((h) => h.featured === true)
		case "created_within_days": {
			const ms = (v ?? 30) * 24 * 60 * 60 * 1000
			return hotels.filter((h) => h.createdAt && Date.now() - h.createdAt <= ms)
		}
	}
}

/**
 * Renvoie les hôtels figés sélectionnés à la main par l'éditeur, dans l'ordre fourni.
 */
export function applyManual(hotelIds: string[], hotels: CanalHotel[]): CanalHotel[] {
	const order = new Map(hotelIds.map((id, i) => [id, i]))
	return hotels
		.filter((h) => order.has(h.hotelId))
		.sort((a, b) => (order.get(a.hotelId) ?? 0) - (order.get(b.hotelId) ?? 0))
}

/**
 * Padding : si la rail a moins de `min` hôtels, on complète avec les mieux notés
 * non-déjà-présents (préserve la pertinence visuelle).
 */
export function padTo(matches: CanalHotel[], pool: CanalHotel[], min: number): CanalHotel[] {
	if (matches.length >= min) return matches
	const ids = new Set(matches.map((h) => h.hotelId))
	const ranked = [...pool].sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1
		return b.avgRating - a.avgRating
	})
	const padding = ranked.filter((h) => !ids.has(h.hotelId)).slice(0, min - matches.length)
	return [...matches, ...padding]
}

/**
 * Pipeline complet : applique le mode (filter|manual), pad, tronque à `limit`.
 * Pour le mode `manual`, la sélection éditoriale prime — pas de padding.
 */
export function resolveRail(rail: Rail, hotels: CanalHotel[]): CanalHotel[] {
	const limit = rail.limit ?? 8
	const minToShow = rail.minToShow ?? 5
	const matches = rail.mode === "manual"
		? applyManual(rail.hotelIds ?? [], hotels)
		: applyRailFilter(rail.filter, hotels)
	const padded = rail.mode === "manual" ? matches : padTo(matches, hotels, minToShow)
	return padded.slice(0, limit)
}
