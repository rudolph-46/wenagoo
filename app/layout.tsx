import "react-perfect-scrollbar/dist/css/styles.css";
import "@/public/assets/css/style.css";
import { NavProvider } from "@/lib/nav-context";
import { getOtaPage, listNavProducts } from "@/lib/ota";
import { SiteProvider } from "@/lib/site-context";
import type { Metadata } from "next";
import { Manrope, Merienda } from "next/font/google";

const manrope_init = Manrope({
    weight: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    variable: "--manrope",
    display: "swap",
});
const merienda_init = Merienda({
    weight: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    variable: "--merienda",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Wenago - Multipurpose Travel Booking Next.js Template",
    description: "Multipurpose Travel Booking Next.js Template",
};

export const revalidate = 3600;

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [navItems, siteCms] = await Promise.all([
        listNavProducts(),
        getOtaPage("hotel-grid").catch(() => null),
    ]);

    const siteContent = {
        topBanner: siteCms?.topBanner ?? null,
        footer: siteCms?.footer ?? null,
        paymentMethods: siteCms?.paymentMethods ?? [],
    };

    return (
        <html lang="fr" className={`${manrope_init.variable} ${merienda_init.variable}`}>
            <body>
                <NavProvider items={navItems}>
                    <SiteProvider value={siteContent}>{children}</SiteProvider>
                </NavProvider>
            </body>
        </html>
    );
}
