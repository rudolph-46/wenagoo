"use client"
import type { OtaFooter, OtaPaymentMethod, OtaTopBanner } from "@/lib/ota"
import { createContext, useContext } from "react"

export type SiteContent = {
	topBanner: OtaTopBanner | null
	footer: OtaFooter | null
	paymentMethods: OtaPaymentMethod[]
}

const SiteContext = createContext<SiteContent>({ topBanner: null, footer: null, paymentMethods: [] })

export function SiteProvider({
	value,
	children,
}: {
	value: SiteContent
	children: React.ReactNode
}) {
	return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSiteContent(): SiteContent {
	return useContext(SiteContext)
}
