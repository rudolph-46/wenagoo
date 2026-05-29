"use server"

import { anyApi } from "convex/server"
import { getConvexClient } from "@/lib/convex"

export type CreateReservationInput = {
	hotelId: string
	roomTypeId: string
	checkInDate: string // YYYY-MM-DD
	checkOutDate: string // YYYY-MM-DD
	adults: number
	children?: number
	guestFirstName: string
	guestLastName: string
	guestEmail: string
	guestPhone: string
	guestCountry?: string
	specialRequests?: string
}

export type CreateReservationResult =
	| {
		ok: true
		confirmationCode: string
		totalAmount: number
		guestName: string
	}
	| { ok: false; error: string }

export async function createReservation(
	input: CreateReservationInput,
): Promise<CreateReservationResult> {
	try {
		const client = getConvexClient()
		const result = await client.mutation(anyApi.reservations.createPublicBooking, {
			hotelId: input.hotelId,
			roomTypeId: input.roomTypeId,
			checkInDate: input.checkInDate,
			checkOutDate: input.checkOutDate,
			adults: input.adults,
			children: input.children,
			guestFirstName: input.guestFirstName,
			guestLastName: input.guestLastName,
			guestEmail: input.guestEmail,
			guestPhone: input.guestPhone,
			guestCountry: input.guestCountry,
			specialRequests: input.specialRequests,
			source: "honelia",
		})
		return {
			ok: true,
			confirmationCode: result.confirmationCode as string,
			totalAmount: result.totalAmount as number,
			guestName: result.guestName as string,
		}
	} catch (e) {
		const message = e instanceof Error ? e.message : "Erreur inconnue"
		return { ok: false, error: message }
	}
}
