'use client'
import VideoPopup from '@/components/elements/VideoPopup'
import Layout from "@/components/layout/Layout"
import SwiperGroupPaymentSlider from '@/components/slider/SwiperGroupPaymentSlider'
import type { CanalWrapping, HotelDetail, PublicReview, PublicRoomType } from "@/lib/ota"
import { swiperGroup1, swiperGroupAnimate } from "@/util/swiperOption"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import SearchFilterBottom from '@/components/elements/SearchFilterBottom'

type Props = {
	data: HotelDetail
	rooms: PublicRoomType[]
	reviews: PublicReview[]
	wrapping: CanalWrapping | null
}

function formatPrice(amount: number): string {
	return new Intl.NumberFormat("fr-FR").format(amount) + " XAF"
}

export default function HotelDetailClient({ data, rooms, reviews, wrapping }: Props) {
	const { hotel, content } = data
	const stars = Math.max(0, Math.min(5, Math.round(hotel.stars ?? 5)))
	const bannerImage = hotel.coverUrl || hotel.photosUrls.find(Boolean) || "/assets/imgs/page/hotel/banner-hotel.png"
	const welcomeTitle = content.welcome.title || `Bienvenue à ${hotel.name}`
	const welcomeTagline = content.welcome.tagline || ""
	const welcomeDesc = content.welcome.description || hotel.description || ""
	const visionTitle = content.vision.title || "A New Vision of Luxury"
	const visionDesc = content.vision.description || welcomeDesc
	const visionImages = content.vision.imageUrls.filter(Boolean) as string[]
	const visionImg1 = visionImages[0] || "/assets/imgs/page/hotel/img-vision.png"
	const visionImg2 = visionImages[1] || "/assets/imgs/page/hotel/img-vision2.png"
	const visionImg3 = visionImages[2] || "/assets/imgs/page/hotel/img-vision3.png"

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<section className="box-section box-breadcrumb background-body">
						<div className="container">
							<ul className="breadcrumbs">
								<li> <Link href="/">Home</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								<li> <Link href="/hotel-grid">Hôtels</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								<li> <span className="text-breadcrumb">{hotel.name}</span></li>
							</ul>
						</div>
					</section>
					<section className="section-box box-banner-home3 box-banner-hotel-detail background-body">
						<div className="container">
							<div className="box-swiper mt-0">
								<div className="swiper-container swiper-group-1">
									<Swiper {...swiperGroup1}>
										{(hotel.photosUrls.filter(Boolean).length > 0 ? hotel.photosUrls.filter(Boolean) as string[] : [bannerImage]).map((imgUrl, i) => (
											<SwiperSlide key={i}>
												<div className="item-banner-box" style={{ backgroundImage: `url(${imgUrl})` }}>
													<div className="item-banner-box-inner">
														<span className="btn btn-white-sm">
															{Array.from({ length: stars }).map((_, si) => (
																<img key={si} src="/assets/imgs/page/tour-detail/star-big.svg" alt="" />
															))}
																<span className="ms-2 text-md-bold">{stars}/5</span>
														</span>
														<h1 className="mt-20 mb-20 color-white">{welcomeTitle}</h1>
														{welcomeTagline && <p className="text-xl-medium color-white mb-20">{welcomeTagline}</p>}
														{content.highlights.length > 0 ? (
															<ul className="list-disc">
																{content.highlights.slice(0, 4).map((h, hi) => (
																	<li key={hi}>{h.title}</li>
																))}
															</ul>
														) : hotel.amenities.length > 0 ? (
															<ul className="list-disc">
																{hotel.amenities.slice(0, 4).map((a, hi) => (
																	<li key={hi}>{a}</li>
																))}
															</ul>
														) : null}
													</div>
												</div>
											</SwiperSlide>
										))}
									</Swiper>
									<div className="swiper-pagination swiper-pagination-group-1 swiper-pagination-style-1" />
								</div>
							</div>
							<div className="box-search-advance background-card wow fadeInUp">
								<div className="box-top-search">
									<div className="left-top-search"><Link className="category-link btn-click active" href="#">Tours</Link><Link className="category-link btn-click" href="#">Hotels</Link><Link className="category-link btn-click" href="#">Tickets</Link><Link className="category-link btn-click" href="#">Rental</Link><Link className="category-link btn-click" href="#">Activities</Link></div>
									<div className="right-top-search"><Link className="text-sm-medium need-some-help" href="/help-center">Need some help?</Link></div>
								</div>
								<SearchFilterBottom />
							</div>
						</div>
					</section>
					<section className="section-box box-partners box-hotel-facilities-list background-body">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-4 mb-20">
									<div className="box-authors-partner background-9 wow fadeInUp">
										<div className="authors-partner-left"><img src="/assets/imgs/page/homepage5/author.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/author2.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/author3.png" alt="Wenago" /><span className="item-author">
											<svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
												<rect x="0.5" y="7.448" width={17} height="2.31818" fill="black" />
												<rect x="7.84082" y="17.1072" width={17} height="2.31818" transform="rotate(-90 7.84082 17.1072)" fill="black" />
											</svg></span></div>
										<div className="authors-partner-right">
											<p className="text-sm neutral-1000">1684 people used <strong>Wenago </strong>in the last <strong>24 hours</strong></p>
										</div>
									</div>
								</div>
								<div className="col-lg-8 mb-20 wow fadeInUp">
									<div className="box-numbers-home7">
										<div className="list-numbers wow fadeInUp">
											<div className="item-number">
												<div className="image-top"> <img src="/assets/imgs/page/hotel/airport.svg" alt="Wenago" /></div>
												<p className="text-15-medium neutral-1000">Free Airport <br />Transfer</p>
											</div>
											<div className="item-number">
												<div className="image-top"> <img src="/assets/imgs/page/hotel/living.svg" alt="Wenago" /></div>
												<p className="text-15-medium neutral-1000">Living  Kitchen <br />Area</p>
											</div>
											<div className="item-number">
												<div className="image-top"> <img src="/assets/imgs/page/hotel/front.svg" alt="Wenago" /></div>
												<p className="text-15-medium neutral-1000">Front desk (24-hour)</p>
											</div>
											<div className="item-number">
												<div className="image-top"> <img src="/assets/imgs/page/hotel/wifi.svg" alt="Wenago" /></div>
												<p className="text-15-medium neutral-1000">Free Wifi <br />Internet</p>
											</div>
											<div className="item-number">
												<div className="image-top"> <img src="/assets/imgs/page/hotel/spa.svg" alt="Wenago" /></div>
												<p className="text-15-medium neutral-1000">Spa<br />Sauna</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="section-box box-payments box-vision background-body">
						<div className="container">
							<div className="row align-items-center">
								<div className="col-lg-6 mb-30">
									<div className="box-right-payment"><span className="btn btn-brand-secondary">{`Bienvenue à ${hotel.name}`}</span>
										<h2 className="title-why mb-25 mt-10 neutral-1000">{visionTitle}</h2>
										<p className="text-lg-medium neutral-500 mb-35">{visionDesc}</p>
										<div className="box-telephone-booking">
											<div className="box-tel-left">
												<div className="box-need-help">
													<p className="need-help neutral-1000 text-lg-bold mb-5">Need help? Call us</p><br /><Link className="heading-6 phone-support" href="/tel:1-800-222-8888">1-800-222-8888</Link>
												</div>
											</div>
											<div className="box-tel-right"> <Link className="btn btn-tag" href="#">Availability Rooms
												<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
													<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg></Link></div>
										</div>
										<div className="payment-method">
											<p className="text-sm-bold neutral-500">Payments accepted</p>
											<div className="box-swiper mt-15">
												<div className="swiper-container swiper-group-payment">
													<SwiperGroupPaymentSlider />
												</div>
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
					<section className="section-box box-top-rated-3 box-nearby best-room-hotel background-body">
						<div className="container">
							<h2 className="neutral-1000 wow fadeInUp">{content.roomsSection.title || "Nos meilleures chambres"}</h2>
							<p className="text-xl-medium neutral-500 wow fadeInUp">{content.roomsSection.subtitle || "Réservez en ligne dès aujourd'hui pour un séjour serein."}</p>
							<div className="box-button-tabs wow fadeInUp"> <Link className="btn btn-white" href="#">All</Link><Link className="btn btn-white" href="#">Luxury</Link><Link className="btn btn-white" href="#">Standard</Link><Link className="btn btn-white" href="#">Economy</Link><Link className="btn btn-white" href="#">Business</Link><Link className="btn btn-white" href="#">Royal Class</Link><Link className="btn btn-white" href="#">Superior</Link></div>
								<div className="row mt-65">
									{rooms.length === 0 ? (
										<div className="col-12 text-center py-5">
											<p className="text-md neutral-500">Aucune chambre publiée pour le moment.</p>
										</div>
									) : rooms.map((room) => (
										<div className="col-lg-4 col-md-6 wow fadeInUp" key={room._id}>
											<div className="card-journey-small card-journey-small-type-3 background-card">
												<div className="card-image"> <Link className="wish" href="#">
													<svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
														<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
													</svg></Link><Link href={`/room-detail/${room._id}`}><img src={room.photoUrl || "/assets/imgs/page/hotel/room.png"} alt={room.name} /></Link></div>
												<div className="card-info">
													<div className="card-title"> <Link className="text-lg-bold neutral-1000" href={`/room-detail/${room._id}`}>{room.name}</Link></div>
													<div className="card-program">
														<div className="card-facilities">
															<div className="item-facilities"><p className="pax text-md-medium neutral-1000">{room.maxOccupancy} pers.</p></div>
															<div className="item-facilities"><p className="size text-md-medium neutral-1000">{room.size} m²</p></div>
															<div className="item-facilities"><p className="bed text-md-medium neutral-1000">{room.beds?.reduce((n,b)=>n+(b.count||1),0) || 1} lit{(room.beds?.reduce((n,b)=>n+(b.count||1),0) || 1)>1?"s":""}</p></div>
														</div>
														<div className="endtime">
															<div className="card-price" style={{ whiteSpace: "nowrap" }}>
																<h6 className="neutral-1000 mb-0" style={{ fontSize: 18, fontWeight: 700 }}>{formatPrice(room.basePrice)}</h6>
																<p className="text-sm-medium neutral-500">/ nuit</p>
															</div>
															<div className="card-button"> <Link className="btn btn-gray" href={`/room-detail/${room._id}`}>Réserver</Link></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
						</div>
					</section>
					<section className="section-box box-how-it-work-hotel-detail background-body">
						<div className="container">
							<div className="box-banner-left-how" />
							<div className="row">
								<div className="col-md-6" />
								<div className="col-md-6">
									<h3 className="neutral-1000 wow fadeInUp">How It Work ?</h3>
									<p className="text-xl-medium neutral-500 wow fadeInUp mb-40">Just 4 easy and quick steps</p>
									<ul className="list-steps wow fadeInUp">
										<li>
											<div className="step-no">   <span>1</span></div>
											<div className="step-info">
												<p className="text-xl-bold neutral-1000">Browse and Select</p>
												<p className="text-sm-medium neutral-500">Easily find your perfect car. Filter by model, brand, and size for a seamless selection process.</p>
											</div>
										</li>
										<li>
											<div className="step-no">   <span>2</span></div>
											<div className="step-info">
												<p className="text-xl-bold neutral-1000">Booking and Reservation</p>
												<p className="text-sm-medium neutral-500">Quickly reserve with flexible dates and locations. Real-time availability updates ensure a smooth booking experience.</p>
											</div>
										</li>
										<li>
											<div className="step-no">   <span>3</span></div>
											<div className="step-info">
												<p className="text-xl-bold neutral-1000">Payment and Confirmation</p>
												<p className="text-sm-medium neutral-500">Secure payments, various methods accepted. Instant confirmation for a hassle-free rental process.</p>
											</div>
										</li>
										<li>
											<div className="step-no">   <span>4</span></div>
											<div className="step-info">
												<p className="text-xl-bold neutral-1000">Pickup and Return</p>
												<p className="text-sm-medium neutral-500">Effortless pickup and return. Simple documentation, optional services like delivery, and excellent customer support.</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</section>
					<section className="section-box box-picked box-hotel-video background-body">
						<div className="container">
							<div className="row align-items-end">
								<div className="col-md-9 mb-30 wow fadeInUp">
									<h2 className="neutral-1000">Our Video Gallery</h2>
									<p className="text-xl-medium neutral-500">Quality as judged by customers. Book at the ideal price!</p>
								</div>
								<div className="col-md-3 mb-30 wow fadeInUp">
									<div className="d-flex justify-content-center justify-content-md-end"><Link className="btn btn-black-lg" href="#">View More
										<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
											<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
										</svg></Link></div>
								</div>
							</div>
							<div className="box-videos-small wow fadeInUp">
								<div className="bg-video background-2" />
								<div className="row">
									<div className="col-lg-7">
										<div className="card-grid-video">
											<div className="card-image">
												<VideoPopup vdocls="btn btn-play popup-youtube" />
												<img className="mr-10" src="/assets/imgs/page/homepage7/img-video.png" alt="Travile" /></div>
											<div className="card-info">
												<h4>The Venetian and The Palazzo - Las Vegas, USA</h4>
												<p className="text-md-medium">8 Resort. 24 rooms</p>
											</div>
										</div>
									</div>
									<div className="col-lg-5">
										<div className="list-videos-small">
											<div className="item-video-small">
												<div className="item-image">

													<VideoPopup vdocls="btn btn-play-sm popup-youtube" />

													<img className="mr-10" src="/assets/imgs/page/homepage7/img-video.png" alt="Travile" /></div>
												<div className="item-info"> <Link className="heading-6" href="#">The Burj Al Arab Dubai, UAE</Link>
													<p className="text-md-medium neutral-500">8 Resort. 24 rooms</p>
												</div>
											</div>
											<div className="item-video-small">
												<div className="item-image"><VideoPopup vdocls="btn btn-play-sm popup-youtube" /><img className="mr-10" src="/assets/imgs/page/homepage7/img-video2.png" alt="Travile" /></div>
												<div className="item-info"> <Link className="heading-6" href="#">The Burj Al Arab Dubai, UAE</Link>
													<p className="text-md-medium neutral-500">8 Resort. 24 rooms</p>
												</div>
											</div>
											<div className="item-video-small">
												<div className="item-image"><VideoPopup vdocls="btn btn-play-sm popup-youtube" /><img className="mr-10" src="/assets/imgs/page/homepage7/img-video3.png" alt="Travile" /></div>
												<div className="item-info"> <Link className="heading-6" href="#">The Burj Al Arab Dubai, UAE</Link>
													<p className="text-md-medium neutral-500">8 Resort. 24 rooms</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

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

					<section className="section-box box-testimonials-2 box-testimonials-5 box-testimonials-hotel-detail background-body">
						<div className="container">
							<div className="box-author-testimonials button-bg-2 wow fadeInUp"> <img src="/assets/imgs/page/homepage1/testimonial.png" alt="Wenago" /><img src="/assets/imgs/page/homepage1/testimonial2.png" alt="Wenago" /><img src="/assets/imgs/page/homepage1/testimonial3.png" alt="Wenago" />Testimonials</div>
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
																		<div className="card-image"> <img src="/assets/imgs/page/homepage1/author.png" alt={r.guestName} /></div>
																		<div className="card-info">
																			<p className="text-lg-bold neutral-1000">{r.guestName}</p>
																			{r.guestCountry && <p className="text-sm neutral-1000">{r.guestCountry}</p>}
																		</div>
																	</div>
																	<div className="card-rate">
																		{Array.from({ length: Math.round(r.rating) }).map((_, si) => (<img key={si} src="/assets/imgs/template/icons/star.svg" alt="" />))}
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
					<section className="section-box box-media background-body">
						<div className="container-media wow fadeInUp"> <img src="/assets/imgs/page/homepage5/media.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media2.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media3.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media4.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media5.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media6.png" alt="Wenago" /><img src="/assets/imgs/page/homepage5/media7.png" alt="Wenago" /></div>
					</section>
				</main>

			</Layout>
		</>
	)
}