import "react-perfect-scrollbar/dist/css/styles.css";
import "@/public/assets/css/style.css";
import { NavProvider } from "@/lib/nav-context";
import { listNavProducts } from "@/lib/ota";
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

export const revalidate = 60;

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navItems = await listNavProducts();

    return (
        <html lang="en" className={`${manrope_init.variable} ${merienda_init.variable}`}>
            <body>
                <NavProvider items={navItems}>{children}</NavProvider>
            </body>
        </html>
    );
}
