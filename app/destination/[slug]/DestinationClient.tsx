'use client'
import CanalHotelCard from '@/components/elements/hotelcard/CanalHotelCard'
import Layout from "@/components/layout/Layout"
import type { CanalHotel, CityContent } from "@/lib/ota"
import { swiperGroupAnimate } from "@/util/swiperOption"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"

type Props = {
	city: CityContent
	cityHotels: CanalHotel[]
}

const BANNER_FALLBACKS = [
	'/assets/imgs/page/destination/banner6.png',
	'/assets/imgs/page/destination/banner7.png',
	'/assets/imgs/page/destination/banner8.png',
	'/assets/imgs/page/destination/banner9.png',
	'/assets/imgs/page/destination/banner10.png',
]
const NEIGHBORHOOD_FALLBACK = '/assets/imgs/page/homepage6/destination.png'

export default function DestinationClient({ city, cityHotels }: Props) {
	const banners = city.bannerImageUrls.length >= 5
		? city.bannerImageUrls.slice(0, 5)
		: [...city.bannerImageUrls, ...BANNER_FALLBACKS].slice(0, 5)

	const cheapestId =
		cityHotels.length > 1
			? cityHotels.reduce(
				(min, h) => (h.lowestCanalPrice < min.lowestCanalPrice ? h : min),
				cityHotels[0],
			).hotelId
			: null

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				<section className="box-section box-breadcrumb background-body">
					<div className="container">
						<ul className="breadcrumbs">
							<li><Link href="/">Accueil</Link>
								<span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg>
								</span>
							</li>
							<li><Link href="/hotels">Destinations</Link>
								<span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg>
								</span>
							</li>
							<li><span className="text-breadcrumb">{city.name}</span></li>
						</ul>
					</div>
				</section>

				<section className="box-section box-banner-destination box-banner-destination-4 background-body">
					<div className="container">
						<div className="row">
							<div className="col-md-6 order-lg-2">
								<div className="destination-banner-3 mb-20"><img src={banners[2]} alt={city.name} /></div>
								<div className="row">
									<div className="col-6">
										<div className="destination-banner-4 mb-20"><img src={banners[3]} alt={city.name} /></div>
									</div>
									<div className="col-6">
										<div className="destination-banner-5 mb-20"><img src={banners[4]} alt={city.name} /></div>
									</div>
								</div>
							</div>
							<div className="col-md-3 col-6 order-lg-1">
								<div className="destination-banner-1 mb-20"><img src={banners[0]} alt={city.name} /></div>
								<div className="destination-banner-2 mb-20"><img src={banners[0]} alt={city.name} /></div>
							</div>
							<div className="col-md-3 col-6 order-lg-3">
								<div className="destination-banner-6 mb-20"><img src={banners[1]} alt={city.name} /></div>
								<div className="destination-banner-7 mb-20"><img src={banners[1]} alt={city.name} /></div>
							</div>
						</div>
					</div>
				</section>

				{city.isComingSoon && (
					<section className="section-box background-body py-50">
						<div className="container">
							<div className="text-center p-40 wow fadeInUp" style={{ background: 'rgba(63, 143, 206, 0.08)', borderRadius: 12 }}>
								<div style={{ fontSize: 48 }}>🏗️</div>
								<h3 className="neutral-1000 mt-15 mb-10">Bientôt à {city.name}</h3>
								<p className="text-lg-medium neutral-500 mb-25">
									Nous travaillons à étendre le réseau Wenagoo à {city.name}. Hôtels partenaires en cours de sélection. Inscrivez-vous pour être prévenu·e dès l'ouverture.
								</p>
								<Link className="btn btn-brand-secondary" href="/hotels">
									Voir les hôtels disponibles ailleurs →
								</Link>
							</div>
						</div>
					</section>
				)}

				<section className="section-box box-top-search-destination background-body">
					<div className="container">
						<div className="text-center wow fadeInUp">
							<h2 className="neutral-1000">Quartiers et lieux à découvrir à {city.name}</h2>
							<p className="text-xl-medium neutral-500">Les zones préférées des voyageurs.</p>
						</div>
						<div className="box-list-populars">
							<div className="row">
								{city.topDestinations.slice(0, 8).map((d, i) => (
									<div className="col-lg-3 col-sm-6" key={i}>
										<div className="card-popular card-top-destination background-card wow fadeInUp">
											<div className="card-image"><img src={d.imageUrl || NEIGHBORHOOD_FALLBACK} alt={d.label} /></div>
											<div className="card-info">
												<span className="card-title">{d.label}</span>
												<div className="card-meta">
													<div className="meta-links">{city.name}</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="section-box box-why-book-wenago-4 background-body">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-6 mb-30">
								<span className="btn btn-brand-secondary wow fadeInUp">Guide de {city.name}</span>
								<h2 className="mt-15 mb-15 neutral-1000 wow fadeInUp">Ce qu'il faut savoir avant de visiter {city.name}</h2>
								<p className="text-xl-medium neutral-1000 mb-30 wow fadeInUp">{city.description}</p>
								<div className="row">
									<div className="col-sm-6 mb-15"><span className="text-xl-medium neutral-1000">Langue : <strong>{city.infoCard.language}</strong></span></div>
									<div className="col-sm-6 mb-15"><span className="text-xl-medium neutral-1000">Haute saison : <strong>{city.infoCard.peakSeason}</strong></span></div>
									<div className="col-sm-6 mb-15"><span className="text-xl-medium neutral-1000">Fuseau : <strong>{city.infoCard.timeZone}</strong></span></div>
									<div className="col-sm-6 mb-15"><span className="text-xl-medium neutral-1000">Devise : <strong>{city.infoCard.currency}</strong></span></div>
								</div>
							</div>
							<div className="col-lg-6 mb-30">
								<div className="row align-items-center">
									<div className="col-lg-6 col-sm-6">
										<div className="card-why card-why-2 background-1 wow fadeInUp">
											<div className="card-image"><img src="/assets/imgs/page/homepage6/experience.png" alt="Infos" /></div>
											<div className="card-info"><h6 className="text-xl-bold neutral-1000">Infos pratiques</h6></div>
										</div>
										<div className="card-why card-why-2 background-3 wow fadeInUp">
											<div className="card-image" style={{ fontSize: 36 }}>☀️</div>
											<div className="card-info"><h6 className="text-xl-bold neutral-1000">Météo</h6></div>
										</div>
									</div>
									<div className="col-lg-6 col-sm-6">
										<div className="card-why card-why-2 background-2 wow fadeInUp">
											<div className="card-image" style={{ fontSize: 36 }}>🚕</div>
											<div className="card-info"><h6 className="text-xl-bold neutral-1000">Transport</h6></div>
										</div>
										<div className="card-why card-why-2 background-4 wow fadeInUp">
											<div className="card-image" style={{ fontSize: 36 }}>📅</div>
											<div className="card-info"><h6 className="text-xl-bold neutral-1000">Meilleure période</h6></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Curated collections — one section per collection */}
				{(city.collections?.length ?? 0) > 0 ? (
					(city.collections ?? []).map((col, idx) => {
						const isOdd = idx % 2 === 1
						const colCheapestId =
							col.hotels.length > 1
								? col.hotels.reduce(
									(min, h) => (h.lowestCanalPrice < min.lowestCanalPrice ? h : min),
									col.hotels[0],
								).hotelId
								: null
						return (
							<section
								key={col.id}
								className={`section-box box-top-rated ${isOdd ? 'background-3' : 'background-1'}`}
							>
								<div className="container">
									<div className="row align-items-end">
										<div className="col-md-9">
											<h2 className="neutral-1000">
												{col.icon && <span style={{ marginRight: 12 }}>{col.icon}</span>}
												{col.title}
											</h2>
											{col.subtitle && (
												<p className="text-xl-medium neutral-500">{col.subtitle}</p>
											)}
										</div>
									</div>
								</div>
								<div className="container-slider box-swiper-padding">
									<div className="box-swiper mt-30">
										<div className="swiper-container swiper-group-animate swiper-group-journey">
											{col.hotels.length === 0 ? (
												<div className="text-center py-5 px-3">
													<p className="text-md neutral-500">Aucun hôtel dans cette sélection pour l'instant.</p>
												</div>
											) : (
												<Swiper {...swiperGroupAnimate}>
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
					})
				) : (
					/* Fallback: no curated collections → display the city's hotels in a single section */
					<section className="section-box box-top-rated background-1">
						<div className="container">
							<div className="row align-items-end">
								<div className="col-md-9">
									<h2 className="neutral-1000">Hôtels à {city.name}</h2>
									<p className="text-xl-medium neutral-500">
										{cityHotels.length === 0
											? `Aucun hôtel encore disponible à ${city.name}.`
											: `${cityHotels.length} hôtel${cityHotels.length > 1 ? 's' : ''} vérifié${cityHotels.length > 1 ? 's' : ''} dans cette ville.`}
									</p>
								</div>
							</div>
						</div>
						<div className="container-slider box-swiper-padding">
							<div className="box-swiper mt-30">
								<div className="swiper-container swiper-group-animate swiper-group-journey">
									{cityHotels.length === 0 ? (
										<div className="text-center py-5 px-3">
											<p className="text-md neutral-500 mb-20">Pas encore d'hôtels Wenagoo à {city.name}. <br />Explorez les villes ouvertes en attendant.</p>
											<Link className="btn btn-brand-secondary" href="/hotels">Voir tous les hôtels</Link>
										</div>
									) : (
										<Swiper {...swiperGroupAnimate}>
											{cityHotels.map((h) => (
												<SwiperSlide key={h.hotelId}>
													<CanalHotelCard hotel={h} isCheapest={h.hotelId === cheapestId} />
												</SwiperSlide>
											))}
										</Swiper>
									)}
								</div>
							</div>
						</div>
					</section>
				)}

			</main>
		</Layout>
	)
}
