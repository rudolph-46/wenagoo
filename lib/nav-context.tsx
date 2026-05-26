"use client"
import type { NavProduct } from "@/lib/ota"
import { createContext, useContext } from "react"

const NavContext = createContext<NavProduct[] | null>(null)

export function NavProvider({
	items,
	children,
}: {
	items: NavProduct[]
	children: React.ReactNode
}) {
	return <NavContext.Provider value={items}>{children}</NavContext.Provider>
}

export function useNavItems(): NavProduct[] | null {
	return useContext(NavContext)
}

/** Map a product code to its public route in wenagoo. */
export const PRODUCT_HREF: Record<string, string> = {
	home: "/hotel-grid",
	tours: "/tour-grid",
	destinations: "/destination",
	activities: "/activities",
	hotel: "/hotel-grid",
	apartment: "/rental-property",
	"car-rental": "/rental-car",
	rental: "/rental-car",
	transport: "/tickets",
	tickets: "/tickets",
	contact: "/contact",
}

export function hrefForCode(code: string): string {
	return PRODUCT_HREF[code] ?? "#"
}
