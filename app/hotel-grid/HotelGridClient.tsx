'use client'
import CagegoryFilter2 from '@/components/elements/CagegoryFilter2'
import SearchFilterBottom from '@/components/elements/SearchFilterBottom'
import CanalHotelCard from '@/components/elements/hotelcard/CanalHotelCard'
import Layout from "@/components/layout/Layout"
import SwiperGroup8Slider from '@/components/slider/SwiperGroup8Slider'
import type { CanalHotel, OtaPageContent } from "@/lib/ota"
import Link from "next/link"

type Props = {
	cms: OtaPageContent
	hotels: CanalHotel[]
}

export default function HotelGridClient({ cms, hotels }: Props) {
	const heroBg = cms.hero.backgroundImageUrl
		? { backgroundImage: `url(${cms.hero.backgroundImageUrl})` }
		: undefined

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				<section className="box-section block-banner-tourlist" style={heroBg}>
					<div className="container">
						<div className="text-center">
							<h3>{cms.hero.title}</h3>
							<h6 className="heading-6-medium">{cms.hero.subtitle}</h6>
						</div>
						<div className="box-search-advance box-search-advance-3 background-card wow fadeInUp">
							<SearchFilterBottom />
						</div>
					</div>
				</section>
				<section className="box-section box-buttons-hotels background-body">
					<div className="container">
						<CagegoryFilter2 />
					</div>
				</section>
				<section className="box-section block-content-hotel background-body">
					<div className="container">
						<div className="box-filters mb-25 pb-5 border-bottom border-1 d-flex flex-wrap align-items-center justify-content-between gap-3">
							<div className="d-flex align-items-center gap-3">
								<div className="d-flex gap-2">
									<button type="button" className="btn btn-gray p-2" aria-label="Vue grille">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" /></svg>
									</button>
									<button type="button" className="btn btn-gray p-2" aria-label="Vue liste">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" /><circle cx="4" cy="6" r="1.5" fill="currentColor" /><circle cx="4" cy="12" r="1.5" fill="currentColor" /><circle cx="4" cy="18" r="1.5" fill="currentColor" /></svg>
									</button>
								</div>
								<p className="text-md-medium neutral-500 mb-0">
									{hotels.length > 0 ? `1 - ${hotels.length} sur ${hotels.length} hôtel${hotels.length > 1 ? 's' : ''} trouvé${hotels.length > 1 ? 's' : ''}` : 'Aucun résultat'}
								</p>
							</div>
							<div className="d-flex align-items-center gap-3">
								<button type="button" className="btn btn-link text-md-medium neutral-700 p-0">Effacer filtres</button>
								<label className="d-flex align-items-center gap-2 mb-0">
									<span className="text-md-medium neutral-500">Afficher</span>
									<select className="form-select form-select-sm" defaultValue="10" style={{ width: '70px' }}>
										<option>10</option>
										<option>20</option>
										<option>50</option>
									</select>
								</label>
								<label className="d-flex align-items-center gap-2 mb-0">
									<span className="text-md-medium neutral-500">Trier par</span>
									<select className="form-select form-select-sm" defaultValue="name" style={{ width: '120px' }}>
										<option value="name">Nom</option>
										<option value="price-asc">Prix croissant</option>
										<option value="price-desc">Prix décroissant</option>
										<option value="rating">Note</option>
									</select>
								</label>
							</div>
						</div>
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
												<CanalHotelCard hotel={hotel} />
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
				<section className="section-box box-popular-destinations background-body pb-90">
					<div className="container">
						<div className="text-center">
							<h4 className="neutral-1000 wow fadeInUp">Hotel by Attractions</h4>
							<p className="text-xl-medium neutral-500 wow fadeInUp">Navigate the Globe with Confidence</p>
						</div>
						<div className="box-swiper box-swiper-pd mt-30 wow fadeInDown">
							<div className="swiper-container swiper-group-8">
								<SwiperGroup8Slider />
							</div>
							<div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-group-8">
								<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
									<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
							<div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-group-8">
								<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
									<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						</div>
					</div>
				</section>
				<section className="section-box box-install-app-2 background-body">
					<div className="container">
						<div className="block-install-app background-6">
							<div className="row align-items-center">
								<div className="col-lg-6">
									<div className="box-item-download wow fadeInUp">
										<span className="btn btn-brand-secondary">Install APP   Get  discount code</span>
										<h5 className="mt-15 mb-30">{cms.promoBanner.title}</h5>
										{cms.promoBanner.subtitle && (
											<p className="text-md neutral-500 mb-20">{cms.promoBanner.subtitle}</p>
										)}
										<div className="box-button-download">
											<Link href={cms.promoBanner.playStoreUrl || "#"}>
												<img src="/assets/imgs/page/homepage6/googleplay.png" alt="Google Play" />
											</Link>
											<Link href={cms.promoBanner.appStoreUrl || "#"}>
												<img src="/assets/imgs/page/homepage6/appstore.png" alt="App Store" />
											</Link>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<img
										className="wow fadeInUp"
										src={cms.promoBanner.imageUrl ?? "/assets/imgs/page/homepage6/img-download-app.png"}
										alt="Promo"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
				<div className="pb-90 background-body" />
			</main>
		</Layout>
	)
}
