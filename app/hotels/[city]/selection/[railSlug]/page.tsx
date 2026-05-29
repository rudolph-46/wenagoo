import {
	getCityContent,
	listCanalHotelsPricing,
	listCanalHotelsStructure,
	mergeCanalHotels,
} from "@/lib/ota"
import { getRailBySlug, RAILS, railHotelsForCity } from "@/lib/rails-catalog"
import { slugify } from "@/lib/slug"
import CanalHotelCard from "@/components/elements/hotelcard/CanalHotelCard"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type PageParams = { params: Promise<{ city: string; railSlug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
	const { city, railSlug } = await params
	const [cityContent, rail] = await Promise.all([
		getCityContent(city),
		Promise.resolve(getRailBySlug(railSlug)),
	])
	if (!cityContent || !rail) return {}
	const canonical = `/hotels/${city}/selection/${railSlug}`
	return {
		title: rail.metaTitle(cityContent.name),
		description: rail.metaDescription(cityContent.name),
		alternates: { canonical },
		openGraph: {
			title: rail.metaTitle(cityContent.name),
			description: rail.metaDescription(cityContent.name),
			type: "website",
		},
	}
}

export default async function RailCityPage({ params }: PageParams) {
	const { city: citySlug, railSlug } = await params

	const [cityContent, structure, pricing] = await Promise.all([
		getCityContent(citySlug),
		listCanalHotelsStructure(),
		listCanalHotelsPricing(),
	])

	if (!cityContent) notFound()
	const rail = getRailBySlug(railSlug)
	if (!rail) notFound()

	const cityNormalized = slugify(cityContent.name)
	const cityHotels = mergeCanalHotels(structure, pricing).filter(
		(h) => slugify(h.city) === cityNormalized,
	)
	const matched = railHotelsForCity(rail, cityHotels)

	const copy = rail.copy(cityContent.name, matched)
	const heroBg = cityContent.bannerImageUrls?.[0] || "/assets/imgs/page/destination/banner2.png"

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				{/* Breadcrumbs */}
				<section className="box-section box-breadcrumb background-body">
					<div className="container">
						<ul className="breadcrumbs">
							<li>
								<Link href="/">Accueil</Link>
								<span className="arrow-right">›</span>
							</li>
							<li>
								<Link href="/hotels">Hôtels</Link>
								<span className="arrow-right">›</span>
							</li>
							<li>
								<Link href={`/hotels/${citySlug}`}>{cityContent.name}</Link>
								<span className="arrow-right">›</span>
							</li>
							<li><span>{rail.title}</span></li>
						</ul>
					</div>
				</section>

				{/* Hero */}
				<section
					className="section-banner background-body"
					style={{
						backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroBg})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						padding: "80px 0",
						color: "#fff",
					}}
				>
					<div className="container text-center">
						<p className="text-xl-medium mb-10" style={{ color: "#fff", opacity: 0.85 }}>
							{rail.icon} {rail.subtitle}
						</p>
						<h1 className="text-display-3 mb-15" style={{ color: "#fff" }}>
							{rail.title} à {cityContent.name}
						</h1>
						<p className="text-lg-medium" style={{ color: "#fff", opacity: 0.9 }}>
							{matched.length} hôtel{matched.length > 1 ? "s" : ""} sélectionné{matched.length > 1 ? "s" : ""} à {cityContent.name}
						</p>
					</div>
				</section>

				{/* Editorial copy (SEO content) */}
				<section className="section-box background-body" style={{ paddingTop: 60, paddingBottom: 40 }}>
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-lg-8">
								<p className="text-md-medium neutral-700 mb-0" style={{ lineHeight: 1.75, fontSize: 17 }}>
									{copy}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Hotel grid */}
				<section className="section-box background-body" style={{ paddingTop: 20, paddingBottom: 80 }}>
					<div className="container">
						{matched.length === 0 ? (
							<div className="text-center py-5">
								<p className="text-md neutral-500 mb-3">
									Aucun hôtel ne correspond à ce critère à {cityContent.name} pour le moment.
								</p>
								<Link href={`/hotels/${citySlug}`} className="btn btn-black-lg-square">
									Voir tous les hôtels de {cityContent.name}
								</Link>
							</div>
						) : (
							<>
								<div className="d-flex justify-content-between align-items-end mb-30 flex-wrap" style={{ gap: 16 }}>
									<div>
										<h2 className="neutral-1000 mb-5">Notre sélection</h2>
										<p className="text-md-medium neutral-500 mb-0">Tous les paiements en Mobile Money. Aucune commission cachée.</p>
									</div>
									<Link href={`/hotels/${citySlug}`} className="btn btn-default">
										← Voir tous les hôtels
									</Link>
								</div>
								<div className="row g-4">
									{matched.map((h) => (
										<div className="col-xl-3 col-lg-4 col-md-6" key={h.hotelId}>
											<CanalHotelCard hotel={h} />
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</section>

				{/* Other rails for this city — cross-linking */}
				<section className="section-box background-body" style={{ paddingTop: 40, paddingBottom: 60, background: "#F9FAFB" }}>
					<div className="container">
						<h3 className="neutral-1000 mb-20 text-center">Autres sélections à {cityContent.name}</h3>
						<div className="row g-3 justify-content-center">
							{RAILS.filter((r) => r.slug !== rail.slug).map((r) => (
								<div className="col-lg-3 col-md-4 col-sm-6" key={r.slug}>
									<Link
										href={`/hotels/${citySlug}/selection/${r.slug}`}
										className="background-card d-block p-3 text-center"
										style={{ borderRadius: 12, textDecoration: "none" }}
									>
										<div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
										<p className="text-md-bold neutral-1000 mb-0">{r.title}</p>
										<p className="text-sm neutral-500 mb-0">à {cityContent.name}</p>
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	)
}
