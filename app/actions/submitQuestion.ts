"use server"

import { anyApi } from "convex/server"
import { getConvexClient } from "@/lib/convex"

export type SubmitQuestionInput = {
	hotelId: string
	roomTypeId?: string
	name: string
	phone: string
	question: string
}

export type SubmitQuestionResult = { ok: true } | { ok: false; error: string }

export async function submitQuestion(input: SubmitQuestionInput): Promise<SubmitQuestionResult> {
	try {
		const client = getConvexClient()
		// Reuse the hotelier's customer-service inbox: synthesize an email from the phone
		// number so the thread can be created (contactThreads requires email).
		const digits = input.phone.replace(/\D/g, "")
		const syntheticEmail = `${digits || "anonymous"}@whatsapp.wenagoo.local`
		await client.mutation(anyApi.contactMessages.submitContactForm, {
			hotelId: input.hotelId,
			name: input.name,
			email: syntheticEmail,
			phone: input.phone,
			subject: "Question depuis Wenagoo",
			message: input.question,
		})
		return { ok: true }
	} catch (e) {
		const message = e instanceof Error ? e.message : "Erreur inconnue"
		return { ok: false, error: message }
	}
}
