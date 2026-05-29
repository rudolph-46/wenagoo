'use client'
import CagegoryFilter2 from '@/components/elements/CagegoryFilter2'
import SearchFilterBottom from '@/components/elements/SearchFilterBottom'
import CanalHotelCard from '@/components/elements/hotelcard/CanalHotelCard'
import Layout from "@/components/layout/Layout"
import SwiperGroup8Slider from '@/components/slider/SwiperGroup8Slider'
import type { CanalHotel, CityCollection, OtaPageContent } from "@/lib/ota"
import { swiperGroupAnimate } from "@/util/swiperOption"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"

type Props = {
	cms: OtaPageContent
	hotels: CanalHotel[]
	cityFilter?: string | null
	cityCollections?: CityCollection[]
}

export default function HotelGridClient({ cms, hotels, cityFilter, cityCollections = [] }: Props) {
	const heroBg = cms.hero.backgroundImageUrl
		? { backgroundImage: `url(${cms.hero.backgroundImageUrl})` }
		: undefined

	const cheapestId =
		hotels.length > 1
			? hotels.reduce((min, h) => (h.lowestCanalPrice < min.lowestCanalPrice ? h : min), hotels[0]).hotelId
			: null

	const heroTitle = cityFilter ? `Hôtels à ${cityFilter}` : cms.hero.title
	const heroSubtitle = cityFilter
		? `${hotels.length} hôtel${hotels.length > 1 ? "s" : ""} disponible${hotels.length > 1 ? "s" : ""} dans cette ville.`
		: cms.hero.subtitle

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				<section className="box-section block-banner-tourlist" style={heroBg}>
					<div className="container">
						<div className="text-center">
							<h3>{heroTitle}</h3>
							<h6 className="heading-6-medium">{heroSubtitle}</h6>
							{cityFilter && (
								<div className="mt-15">
									<Link href="/hotel-grid" className="btn btn-white">
										← Voir tous les hôtels
									</Link>
								</div>
							)}
						</div>
						<div className="box-search-advance box-search-advance-3 background-card wow fadeInUp">
							<SearchFilterBottom />
						</div>
					</div>
				</section>
				{(() => {
					const hasCollections = !!cityFilter && cityCollections.length > 0

					const renderCollection = (col: CityCollection, idx: number) => {
						const colCheapestId =
							col.hotels.length > 1
								? col.hotels.reduce(
									(min, h) => (h.lowestCanalPrice < min.lowestCanalPrice ? h : min),
									col.hotels[0],
								).hotelId
								: null
						const navKey = `col-${col.id ?? idx}`
						const swiperConfig = {
							...swiperGroupAnimate,
							slidesPerView: 1.2,
							spaceBetween: 20,
							navigation: {
								nextEl: `.swiper-next-${navKey}`,
								prevEl: `.swiper-prev-${navKey}`,
							},
							breakpoints: {
								576: { slidesPerView: 2, spaceBetween: 20 },
								768: { slidesPerView: 2.5, spaceBetween: 20 },
								992: { slidesPerView: 3, spaceBetween: 24 },
								1200: { slidesPerView: 4, spaceBetween: 24 },
							},
						}
						return (
							<section
								key={col.id ?? idx}
								className="section-box box-our-featured background-body pt-80"
							>
								<div className="container">
									<div className="row align-items-end">
										<div className="col-md-8 col-lg-9 mb-30 text-center text-md-start wow fadeInUp">
											<h2 className="neutral-1000">
												{col.icon && <span style={{ marginRight: 12 }}>{col.icon}</span>}
												{col.title}
											</h2>
											{col.subtitle && (
												<p className="text-xl-medium neutral-500 mb-0">{col.subtitle}</p>
											)}
										</div>
										<div className="col-md-4 col-lg-3 mb-30 d-flex align-items-center justify-content-center justify-content-md-end gap-3 wow fadeInUp">
											<button
												type="button"
												className={`swiper-button-prev swiper-button-prev-style-1 swiper-prev-${navKey}`}
												aria-label="Précédent"
												style={{ position: 'static', margin: 0 }}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
													<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</button>
											<button
												type="button"
												className={`swiper-button-next swiper-button-next-style-1 swiper-next-${navKey}`}
												aria-label="Suivant"
												style={{ position: 'static', margin: 0 }}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
													<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</button>
											{cityFilter && (
												<Link
													href={`/hotel-grid?city=${encodeURIComponent(cityFilter)}`}
													className="btn btn-brand-secondary ms-2"
												>
													Voir plus
												</Link>
											)}
										</div>
									</div>
									<div className="box-swiper mt-30">
										<div className="swiper-container swiper-group-animate swiper-group-journey pb-0">
											{col.hotels.length === 0 ? (
												<div className="text-center py-5 px-3">
													<p className="text-md neutral-500">Aucun hôtel dans cette sélection pour l'instant.</p>
												</div>
											) : (
												<Swiper {...swiperConfig}>
													{col.hotels.map((h) => (
														<SwiperSlide key={h.hotelId}>
															<CanalHotelCard hotel={h} isCheapest={h.hotelId === colCheapestId} />
														</SwiperSlide>
													))}
												</Swiper>
											)}
										</div>
									</div>
								</div>
							</section>
						)
					}

					const howItWorks = (
						<section id="how-it-works" className="section-box box-why-book-wenago-4 background-body py-90">
							<div className="container">
								<div className="row align-items-center">
									<div className="col-lg-6 mb-30">
										<span className="btn btn-brand-secondary wow fadeInUp">
											<span style={{ marginRight: 8 }}>🌍</span>
											Guide Wenagoo
										</span>
										<h2 className="mt-15 mb-15 neutral-1000 wow fadeInUp">Réserver avec Wenagoo, c'est simple.</h2>
										<p className="text-xl-medium neutral-1000 mb-30 wow fadeInUp">
											Comparez des hôtels vérifiés, réservez en moins d'une minute et payez en Mobile Money. Notre équipe vous accompagne sur WhatsApp en français, 24h/24.
										</p>
										<div className="row">
											<div className="col-sm-6 mb-15">
												<span className="text-xl-medium neutral-1000">Paiement : <strong>Mobile Money</strong></span>
											</div>
											<div className="col-sm-6 mb-15">
												<span className="text-xl-medium neutral-1000">Confirmation : <strong>SMS & WhatsApp</strong></span>
											</div>
											<div className="col-sm-6 mb-15">
												<span className="text-xl-medium neutral-1000">Support : <strong>24/7 en français</strong></span>
											</div>
											<div className="col-sm-6 mb-15">
												<span className="text-xl-medium neutral-1000">Devise : <strong>FCFA (XAF)</strong></span>
											</div>
										</div>
									</div>
									<div className="col-lg-6 mb-30">
										<div className="row align-items-center">
											<div className="col-lg-6 col-sm-6">
												<div className="card-why card-why-2 background-1 wow fadeInUp">
													<div className="card-image" style={{ fontSize: 36 }}>🔍</div>
													<div className="card-info">
														<h6 className="text-xl-bold neutral-1000">Choisissez</h6>
													</div>
												</div>
												<div className="card-why card-why-2 background-3 wow fadeInUp">
													<div className="card-image" style={{ fontSize: 36 }}>📅</div>
													<div className="card-info">
														<h6 className="text-xl-bold neutral-1000">Réservez</h6>
													</div>
												</div>
											</div>
											<div className="col-lg-6 col-sm-6">
												<div className="card-why card-why-2 background-2 wow fadeInUp">
													<div className="card-image" style={{ fontSize: 36 }}>📱</div>
													<div className="card-info">
														<h6 className="text-xl-bold neutral-1000">Payez en MoMo</h6>
													</div>
												</div>
												<div className="card-why card-why-2 background-4 wow fadeInUp">
													<div className="card-image" style={{ fontSize: 36 }}>🏨</div>
													<div className="card-info">
														<h6 className="text-xl-bold neutral-1000">Profitez</h6>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					)

					if (hasCollections) {
						// Case A: city + collections → 1st collection, then "Comment ça marche", then the rest
						const [first, ...rest] = cityCollections
						return (
							<>
								{renderCollection(first, 0)}
								{howItWorks}
								{rest.map((c, i) => renderCollection(c, i + 1))}
							</>
						)
					}

					// Case B: no city filter (or no collections) → flat list, then Comment ça marche
					return (
						<>
							<section className="box-section block-content-hotel background-body">
								<div className="container">
									<div className="box-content-main-hotel-2">
										{hotels.length === 0 ? (
											<div className="text-center py-5">
												<p className="text-lg neutral-500">Aucun hôtel disponible pour le moment.</p>
											</div>
										) : (
											<div className="box-grid-tours wow fadeIn">
												<div className="row">
													{hotels.map((hotel) => (
														<div className="col-xl-3 col-lg-4 col-md-6 mb-30" key={hotel.hotelId}>
															<CanalHotelCard hotel={hotel} isCheapest={hotel.hotelId === cheapestId} />
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							</section>
							{howItWorks}
						</>
					)
				})()}

			</main>
		</Layout>
	)
}
