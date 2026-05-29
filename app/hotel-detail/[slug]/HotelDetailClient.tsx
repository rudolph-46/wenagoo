'use client'
import VideoPopup from '@/components/elements/VideoPopup'
import Layout from "@/components/layout/Layout"
import SwiperGroupPaymentSlider from '@/components/slider/SwiperGroupPaymentSlider'
import type { CanalHotel, CanalWrapping, HotelDetail, PublicReview, PublicRoomType } from "@/lib/ota"
import CanalHotelCard from "@/components/elements/hotelcard/CanalHotelCard"
import { useSiteContent } from '@/lib/site-context'
import { slugify } from '@/lib/slug'
import { swiperGroup1, swiperGroupAnimate } from "@/util/swiperOption"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import SearchFilterBottom from '@/components/elements/SearchFilterBottom'

type Props = {
	data: HotelDetail
	rooms: PublicRoomType[]
	reviews: PublicReview[]
	wrapping: CanalWrapping | null
	similarHotels?: CanalHotel[]
	citySlug?: string
}

function formatPrice(amount: number): string {
	return new Intl.NumberFormat("fr-FR").format(amount) + " XAF"
}

const HIGHLIGHT_ICON_FALLBACK = "/assets/imgs/page/hotel/wifi.svg"
const HIGHLIGHT_ICONS: Record<string, string> = {
	wifi: "/assets/imgs/page/hotel/wifi.svg",
	airport: "/assets/imgs/page/hotel/airport.svg",
	transfer: "/assets/imgs/page/hotel/airport.svg",
	front: "/assets/imgs/page/hotel/front.svg",
	reception: "/assets/imgs/page/hotel/front.svg",
	spa: "/assets/imgs/page/hotel/spa.svg",
	kitchen: "/assets/imgs/page/hotel/living.svg",
	living: "/assets/imgs/page/hotel/living.svg",
}

function iconUrlFor(name?: string): string {
	if (!name) return HIGHLIGHT_ICON_FALLBACK
	const key = name.toLowerCase().trim()
	return HIGHLIGHT_ICONS[key] ?? HIGHLIGHT_ICON_FALLBACK
}

export default function HotelDetailClient({ data, rooms, reviews, wrapping, similarHotels = [], citySlug }: Props) {
	const { hotel, content } = data
	const { footer, paymentMethods: globalPaymentMethods } = useSiteContent()
	const whatsapp = content.whatsapp || footer?.whatsapp || ""
	const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null
	const hotelPayments = content.paymentMethods ?? []
	const paymentMethods = hotelPayments.length > 0 ? hotelPayments : globalPaymentMethods

	const stars = Math.max(0, Math.min(5, Math.round(hotel.stars ?? 5)))
	const bannerImage = hotel.coverUrl || hotel.photosUrls.find(Boolean) || "/assets/imgs/page/hotel/banner-hotel.png"
	const welcomeTitle = content.welcome.title || `Bienvenue à ${hotel.name}`
	const welcomeTagline = content.welcome.tagline || ""
	const welcomeDesc = content.welcome.description || hotel.description || ""
	const visionTitle = content.vision.title || "Une nouvelle vision de l'hospitalité"
	const visionDesc = content.vision.description || welcomeDesc
	const visionImages = content.vision.imageUrls.filter(Boolean) as string[]
	const visionImg1 = visionImages[0] || "/assets/imgs/page/hotel/img-vision.png"
	const visionImg2 = visionImages[1] || "/assets/imgs/page/hotel/img-vision2.png"
	const visionImg3 = visionImages[2] || "/assets/imgs/page/hotel/img-vision3.png"

	const highlights = content.highlights.slice(0, 5)
	const videoItems = content.videoGallery.items
	const howItWorks = content.howItWorks

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<section className="box-section box-breadcrumb background-body">
						<div className="container">
							<ul className="breadcrumbs">
								<li><Link href="/">Accueil</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								<li><Link href="/hotels">Hôtels</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								{hotel.address?.city && (
									<li><Link href={`/hotels/${slugify(hotel.address.city)}`}>{hotel.address.city}</Link><span className="arrow-right">
										<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
										</svg></span></li>
								)}
								<li><span className="text-breadcrumb">{hotel.name}</span></li>
							</ul>
						</div>
					</section>

					<section className="section-box box-banner-home3 box-banner-hotel-detail background-body">
						<div className="container-fluid px-0">
							<div className="box-swiper mt-0 w-100">
								<div className="swiper-container swiper-group-1">
									<Swiper {...swiperGroup1}>
										{(hotel.photosUrls.filter(Boolean).length > 0 ? hotel.photosUrls.filter(Boolean) as string[] : [bannerImage]).map((imgUrl, i) => (
											<SwiperSlide key={i}>
												<div className="item-banner-box" style={{ backgroundImage: `url(${imgUrl})`, borderRadius: 0 }}>
													<div className="item-banner-box-inner">
														<span className="btn btn-white-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
															{Array.from({ length: 5 }).map((_, si) => (
																<img
																	key={si}
																	src="/assets/imgs/page/tour-detail/star-big.svg"
																	alt=""
																	style={{ opacity: si < stars ? 1 : 0.25 }}
																/>
															))}
															<span className="ms-2 text-md-bold">Hôtel {stars} étoile{stars > 1 ? 's' : ''}</span>
														</span>
														<h1 className="mt-20 mb-20 color-white">{welcomeTitle}</h1>
														{welcomeTagline && <p className="text-xl-medium color-white mb-20">{welcomeTagline}</p>}
													</div>
												</div>
											</SwiperSlide>
										))}
									</Swiper>
								</div>
							</div>
							</div>
							<div className="container">
							<div className="box-search-advance background-card wow fadeInUp">
								<SearchFilterBottom />
							</div>
						</div>
					</section>

					{/* Top facilities — driven by content.highlights from CMS */}
					{highlights.length > 0 && (
						<section className="section-box background-body py-50">
							<div className="container">
								<div
									className="wow fadeInUp"
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
										gap: 24,
										textAlign: 'center',
									}}
								>
									{highlights.map((h, i) => (
										<div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
											<img src={iconUrlFor(h.iconName)} alt={h.title} style={{ width: 72, height: 72, objectFit: "contain" }} />
											<p className="text-15-medium neutral-1000 mb-0">{h.title}</p>
										</div>
									))}
								</div>
							</div>
						</section>
					)}

					{/* Vision section */}
					<section className="section-box box-payments box-vision background-body">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-6 mb-30">
									<div className="box-right-payment">
										<span className="btn btn-brand-secondary">Bienvenue à {hotel.name}</span>
										<h2 className="title-why mb-25 mt-10 neutral-1000">{visionTitle}</h2>
										<p className="text-lg-medium neutral-500 mb-35">{visionDesc}</p>
										{whatsappLink && (
											<div className="box-telephone-booking">
												<div className="box-tel-left">
													<div className="box-need-help">
														<p className="need-help neutral-1000 text-lg-bold mb-5">Besoin d'aide ? Contactez-nous</p>
														<Link
															className="btn"
															href={whatsappLink}
															target="_blank"
															rel="noopener noreferrer"
															style={{
																display: "inline-flex",
																alignItems: "center",
																gap: 8,
																backgroundColor: "#25D366",
																color: "#fff",
																padding: "10px 18px",
																borderRadius: 999,
																fontWeight: 600,
																textDecoration: "none",
															}}
														>
															<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
																<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zM20.52 3.449C18.24 1.245 15.24.004 12.045 0 5.463 0 .104 5.358.101 11.94c-.001 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.448h.005c6.581 0 11.940-5.358 11.945-11.939a11.86 11.86 0 00-3.495-8.408z" />
															</svg>
															WhatsApp {whatsapp}
														</Link>
													</div>
												</div>
											</div>
										)}
										<div className="payment-method">
											<p className="text-sm-bold neutral-500">Paiements acceptés</p>
											<div className="box-swiper mt-15">
												{paymentMethods.length > 0 ? (
													<div className="d-flex flex-wrap align-items-center" style={{ gap: 16 }}>
														{paymentMethods.map((pm, i) =>
															pm.imageUrl ? (
																<img key={i} src={pm.imageUrl} alt={pm.label} title={pm.label} style={{ height: 32, width: "auto", objectFit: "contain" }} />
															) : (
																<span key={i} className="text-sm-bold neutral-700">{pm.label}</span>
															),
														)}
													</div>
												) : (
													<div className="swiper-container swiper-group-payment">
														<SwiperGroupPaymentSlider />
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-6 mb-30 text-center text-lg-end">
									<div className="box-image-vision"> <img className="w-100" src={visionImg1} alt={hotel.name} />
										<div className="image-vision-1"><img className="w-100 mb-15" src={visionImg2} alt="" /></div>
										<div className="image-vision-2"><img className="w-100" src={visionImg3} alt="" /></div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Rooms */}
					<section id="rooms" className="section-box box-top-rated-3 box-nearby best-room-hotel background-body">
						<div className="container">
							<h2 className="neutral-1000 wow fadeInUp">{content.roomsSection.title || "Nos meilleures chambres"}</h2>
							<p className="text-xl-medium neutral-500 wow fadeInUp">{content.roomsSection.subtitle || "Réservez votre séjour en quelques clics."}</p>
							<div className="row mt-65">
								{rooms.length === 0 ? (
									<div className="col-12 text-center py-5">
										<p className="text-md neutral-500">Aucune chambre publiée pour le moment.</p>
									</div>
								) : rooms.map((room) => (
									<div className="col-lg-4 col-md-6 wow fadeInUp" key={room._id}>
										<div className="card-journey-small card-journey-small-type-3 background-card">
											<div className="card-image">
												<Link className="wish" href="#" aria-label="Favori">
													<svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
														<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
													</svg>
												</Link>
												<Link href={`/hotels/${slugify(hotel.address.city || "")}/${hotel.slug}/${slugify(room.name)}`}>
													<img src={room.photoUrl || "/assets/imgs/page/hotel/room.png"} alt={room.name} />
												</Link>
											</div>
											<div className="card-info">
												<div className="card-title"><Link className="text-lg-bold neutral-1000" href={`/hotels/${slugify(hotel.address.city || "")}/${hotel.slug}/${slugify(room.name)}`}>{room.name}</Link></div>
												<div className="card-program">
													<div className="card-facilities">
														<div className="item-facilities"><p className="pax text-md-medium neutral-1000">{room.maxOccupancy} pers.</p></div>
														<div className="item-facilities"><p className="size text-md-medium neutral-1000">{room.size} m²</p></div>
														<div className="item-facilities"><p className="bed text-md-medium neutral-1000">{room.beds?.reduce((n,b)=>n+(b.count||1),0) || 1} lit{(room.beds?.reduce((n,b)=>n+(b.count||1),0) || 1)>1?"s":""}</p></div>
														<div className="item-facilities"><p className="bathroom text-md-medium neutral-1000">1 SDB</p></div>
													</div>
													<div className="endtime" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
														<p className="text-sm-medium neutral-500 mb-0">À partir de</p>
														<h6 className="neutral-1000 mb-0" style={{ fontSize: 18, fontWeight: 700 }}>
															{formatPrice(room.basePrice)}
															<span className="text-sm-medium neutral-500" style={{ fontWeight: 400 }}> / nuit</span>
														</h6>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* How It Works — pulled from shared CMS otaPageContent.howItWorks */}
					{howItWorks && howItWorks.steps.length > 0 && (
						<section className="section-box box-how-it-work-hotel-detail background-body">
							<div className="container">
								<div className="box-banner-left-how" />
								<div className="row">
									<div className="col-md-6" />
									<div className="col-md-6">
										<h3 className="neutral-1000 wow fadeInUp">{howItWorks.title || "Comment ça marche ?"}</h3>
										<p className="text-xl-medium neutral-500 wow fadeInUp mb-40">{howItWorks.subtitle || "Quelques étapes simples"}</p>
										<ul className="list-steps wow fadeInUp">
											{howItWorks.steps.map((step, i) => (
												<li key={i}>
													<div className="step-no"><span>{i + 1}</span></div>
													<div className="step-info">
														<p className="text-xl-bold neutral-1000">{step.title}</p>
														<p className="text-sm-medium neutral-500">{step.description}</p>
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</section>
					)}

					{/* Video gallery — only renders if CMS has items */}
					{videoItems.length > 0 && (
						<section className="section-box box-picked box-hotel-video background-body">
							<div className="container">
								<div className="row align-items-end">
									<div className="col-md-12 mb-30 wow fadeInUp">
										<h2 className="neutral-1000">{content.videoGallery.title || "Notre vidéothèque"}</h2>
										<p className="text-xl-medium neutral-500">Découvrez l'hôtel en images</p>
									</div>
								</div>
								<div className="box-videos-small wow fadeInUp">
									<div className="bg-video background-2" />
									<div className="row">
										{videoItems[0] && (
											<div className="col-lg-7">
												<div className="card-grid-video">
													<div className="card-image">
														<VideoPopup vdocls="btn btn-play popup-youtube" />
														<img className="mr-10" src={videoItems[0].thumbnailUrl || "/assets/imgs/page/homepage7/img-video.png"} alt={videoItems[0].title} />
													</div>
													<div className="card-info">
														<h4>{videoItems[0].title}</h4>
														{videoItems[0].location && <p className="text-md-medium">{videoItems[0].location}</p>}
													</div>
												</div>
											</div>
										)}
										{videoItems.length > 1 && (
											<div className="col-lg-5">
												<div className="list-videos-small">
													{videoItems.slice(1, 4).map((v, i) => (
														<div className="item-video-small" key={i}>
															<div className="item-image">
																<VideoPopup vdocls="btn btn-play-sm popup-youtube" />
																<img className="mr-10" src={v.thumbnailUrl || "/assets/imgs/page/homepage7/img-video.png"} alt={v.title} />
															</div>
															<div className="item-info">
																<Link className="heading-6" href="#">{v.title}</Link>
																{v.location && <p className="text-md-medium neutral-500">{v.location}</p>}
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</section>
					)}

					{/* Canal Honelia policies */}
					{wrapping && wrapping.policies.length > 0 && (
						<section className="section-box box-canal-policies background-body py-5">
							<div className="container">
								<h2 className="neutral-1000 mb-30 text-center wow fadeInUp">Notre engagement Canal Honelia</h2>
								<div className="row g-4">
									{wrapping.policies.map((p, i) => (
										<div className="col-md-6 col-lg-4" key={i}>
											<div className="card-policy background-card p-4 rounded h-100">
												{p.icon && <div className="mb-15" style={{ fontSize: 32 }}>{p.icon}</div>}
												<h5 className="neutral-1000 mb-10">{p.title}</h5>
												<p className="text-md-medium neutral-500 mb-0">{p.description}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					)}

					{/* FAQ */}
					{wrapping && wrapping.faq.length > 0 && (
						<section className="section-box box-canal-faq background-body py-5">
							<div className="container">
								<div className="row">
									<div className="col-lg-4 mb-30">
										<h2 className="neutral-1000 wow fadeInUp">Questions fréquentes</h2>
										<p className="text-xl-medium neutral-500 wow fadeInUp">Tout ce qu'il faut savoir avant de réserver via Honelia.</p>
									</div>
									<div className="col-lg-8">
										{wrapping.faq.map((f, i) => (
											<details key={i} className="mb-20 p-3 background-card rounded">
												<summary className="text-lg-bold neutral-1000" style={{ cursor: "pointer", listStyle: "none" }}>
													{f.question}
												</summary>
												<p className="text-md-medium neutral-500 mt-10 mb-0" style={{ whiteSpace: "pre-line" }}>{f.answer}</p>
											</details>
										))}
									</div>
								</div>
							</div>
						</section>
					)}

					{/* Testimonials */}
					<section className="section-box box-testimonials-2 box-testimonials-5 box-testimonials-hotel-detail background-body" style={{ paddingTop: 40, paddingBottom: 40 }}>
						<div className="container">
							<h2 className="mt-8 mb-25 neutral-1000">{content.testimonialsSection.title || "Ce qu'ils disent de nous"}</h2>
						</div>
						<div className="block-testimonials">
							<div className="container-testimonials wow fadeInUp">
								<div className="container-slider">
									<div className="box-swiper mt-0">
										<div className="swiper-container swiper-group-animate swiper-group-journey">
											<Swiper {...swiperGroupAnimate}>
												{reviews.length === 0 ? (
													<SwiperSlide>
														<div className="card-testimonial background-card">
															<div className="card-info"><p className="neutral-500">Pas encore d'avis pour cet établissement.</p></div>
														</div>
													</SwiperSlide>
												) : reviews.map((r) => (
													<SwiperSlide key={r.id}>
														<div className="card-testimonial background-card">
															<div className="card-info">
																{r.title && <p className="text-xl-bold card-title neutral-1000">{r.title}</p>}
																<p className="neutral-500">{r.comment}</p>
															</div>
															<div className="card-top">
																<div className="card-author">
																																		<div className="card-info">
																		<div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><p className="text-lg-bold neutral-1000 mb-0">{r.guestName}</p><span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "#E6F4EA", color: "#137333", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Réservation confirmée</span></div>
																		{r.guestCountry && <p className="text-sm neutral-1000">{r.guestCountry}</p>}
																	</div>
																</div>
																<div className="card-rate">
																	{Array.from({ length: Math.max(0, Math.min(5, Math.round(r.rating / 2))) }).map((_, si) => (<img key={si} src="/assets/imgs/template/icons/star.svg" alt="" />))}
																</div>
															</div>
														</div>
													</SwiperSlide>
												))}
											</Swiper>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Similar hotels — same city */}
					{similarHotels.length > 0 && citySlug && (
						<section className="section-box box-our-featured background-body" style={{ paddingTop: 40, paddingBottom: 60 }}>
							<div className="container">
								<div className="row align-items-end mb-30">
									<div className="col-md-9">
										<h2 className="neutral-1000 wow fadeInUp">Vous pourriez aussi aimer</h2>
										<p className="text-xl-medium neutral-500 wow fadeInUp">D'autres hôtels à découvrir dans la même ville</p>
									</div>
									<div className="col-md-3 text-md-end">
										<Link href={`/hotels/${citySlug}`} className="btn btn-brand-secondary">Voir tous</Link>
									</div>
								</div>
								<div className="row g-4">
									{similarHotels.map((h) => (
										<div className="col-xl-3 col-lg-4 col-md-6" key={h.hotelId}>
											<CanalHotelCard hotel={h} />
										</div>
									))}
								</div>
							</div>
						</section>
					)}
				</main>
			</Layout>
		</>
	)
}
