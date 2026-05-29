'use client'
import Layout from "@/components/layout/Layout"
import SearchFilterBottom from '@/components/elements/SearchFilterBottom'
import ByPagination from '@/components/Filter/ByPagination'
import type { CanalHotel, OtaPageContent, PublicRoomType } from "@/lib/ota"
import { slugify } from "@/lib/slug"
import Link from "next/link"
import { useMemo, useState } from "react"

type City = { slug: string; name: string }

type RoomResult = {
	hotel: CanalHotel
	room: PublicRoomType
}

type Props = {
	cms: OtaPageContent
	cityName: string
	citySlug: string
	cities: City[]
	rooms: RoomResult[]
	checkIn: string
	checkOut: string
	adults: number
	childrenCount: number
}

type SortKey = "price_asc" | "price_desc" | "rating_desc"

const PRICE_MIN = 0

function formatPrice(amount: number): string {
	return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF'
}

function diffNights(ci: string, co: string): number {
	const a = new Date(ci).getTime()
	const b = new Date(co).getTime()
	if (!a || !b || b <= a) return 0
	return Math.ceil((b - a) / (1000 * 60 * 60 * 24))
}

export default function SearchResultsClient({
	cms: _cms,
	cityName,
	citySlug,
	cities,
	rooms,
	checkIn,
	checkOut,
	adults,
	childrenCount,
}: Props) {
	const nights = diffNights(checkIn, checkOut)
	const totalGuests = adults + childrenCount
	const queryString = new URLSearchParams({ checkIn, checkOut, travelers: String(totalGuests) }).toString()

	const uniqueStars = useMemo(() => [...new Set(rooms.map((r) => r.hotel.stars))].sort((a, b) => b - a), [rooms])
	const uniqueTags = useMemo(() => [...new Set(rooms.map((r) => r.hotel.canalTag).filter((t): t is string => !!t))], [rooms])
	const maxPriceInRooms = useMemo(() => rooms.reduce((m, r) => Math.max(m, r.room.basePrice), 0) || 200000, [rooms])

	const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, maxPriceInRooms])
	const [selectedStars, setSelectedStars] = useState<number[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortKey, setSortKey] = useState<SortKey>("price_asc")
	const [itemsPerPage, setItemsPerPage] = useState<number>(12)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const filtered = useMemo(() => {
		return rooms.filter((r) => {
			if (r.room.basePrice < priceRange[0] || r.room.basePrice > priceRange[1]) return false
			if (selectedStars.length > 0 && !selectedStars.includes(r.hotel.stars)) return false
			if (selectedTags.length > 0 && (!r.hotel.canalTag || !selectedTags.includes(r.hotel.canalTag))) return false
			return true
		})
	}, [rooms, priceRange, selectedStars, selectedTags])

	const sorted = useMemo(() => {
		const arr = [...filtered]
		switch (sortKey) {
			case "price_asc": arr.sort((a, b) => a.room.basePrice - b.room.basePrice); break
			case "price_desc": arr.sort((a, b) => b.room.basePrice - a.room.basePrice); break
			case "rating_desc": arr.sort((a, b) => b.hotel.avgRating - a.hotel.avgRating); break
		}
		return arr
	}, [filtered, sortKey])

	const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))
	const startIdx = (currentPage - 1) * itemsPerPage
	const paginated = sorted.slice(startIdx, startIdx + itemsPerPage)
	const startItemIndex = sorted.length > 0 ? startIdx + 1 : 0
	const endItemIndex = Math.min(startIdx + itemsPerPage, sorted.length)

	function toggleStar(s: number) {
		setSelectedStars((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])
		setCurrentPage(1)
	}
	function toggleTag(t: string) {
		setSelectedTags((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])
		setCurrentPage(1)
	}
	function clearFilters() {
		setPriceRange([PRICE_MIN, maxPriceInRooms])
		setSelectedStars([])
		setSelectedTags([])
		setSortKey("price_asc")
		setItemsPerPage(12)
		setCurrentPage(1)
	}

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				{/* Hero */}
				<section className="box-section block-banner-tourlist">
					<div className="container">
						<div className="text-center">
							<h3>Chambres à {cityName}</h3>
							<h6 className="heading-6-medium">
								{rooms.length} chambre{rooms.length > 1 ? 's' : ''} pour {adults} adulte{adults > 1 ? 's' : ''}
								{childrenCount > 0 ? `, ${childrenCount} enfant${childrenCount > 1 ? 's' : ''}` : ''} · du {checkIn} au {checkOut} ({nights} nuit{nights > 1 ? 's' : ''})
							</h6>
						</div>
						<div className="box-search-advance box-search-advance-3 background-card wow fadeInUp">
							<SearchFilterBottom
								cities={cities}
								initialCity={citySlug}
								initialCheckIn={checkIn}
								initialCheckOut={checkOut}
								initialAdults={adults}
								initialChildren={childrenCount}
							/>
						</div>
					</div>
				</section>

				<section className="box-section block-content-tourlist background-body">
					<div className="container">
						<div className="box-content-main">
							{/* RIGHT */}
							<div className="content-right">
								<div className="box-filters mb-25 pb-5 border-bottom border-1">
									<div className="row align-items-center">
										<div className="col-md-6 mb-10">
											<span className="text-sm-bold neutral-500">{startItemIndex} - {endItemIndex} sur {sorted.length} chambre{sorted.length > 1 ? 's' : ''}</span>
										</div>
										<div className="col-md-6 mb-10 text-md-end">
											<div className="box-item-sort d-inline-flex align-items-center" style={{ gap: 8, flexWrap: 'wrap' }}>
												<button type="button" className="btn btn-default" onClick={clearFilters}>Effacer filtres</button>
												<div className="item-sort border-1">
													<span className="text-xs-medium neutral-500 mr-5">Afficher</span>
													<select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
														<option value={12}>12</option>
														<option value={24}>24</option>
														<option value={48}>48</option>
													</select>
												</div>
												<div className="item-sort border-1">
													<span className="text-xs-medium neutral-500 mr-5">Trier par</span>
													<select value={sortKey} onChange={(e) => { setSortKey(e.target.value as SortKey); setCurrentPage(1) }}>
														<option value="price_asc">Prix croissant</option>
														<option value="price_desc">Prix décroissant</option>
														<option value="rating_desc">Mieux notés</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>

								{paginated.length === 0 ? (
									<div className="text-center py-5">
										<div style={{ fontSize: 48, marginBottom: 12 }}>🛏️</div>
										<h5 className="neutral-1000 mb-2">Aucune chambre ne correspond à vos critères</h5>
										<p className="text-md neutral-500 mb-3">Essayez d&apos;élargir les filtres ou de réduire le nombre de voyageurs.</p>
										<button type="button" className="btn btn-black-lg-square" onClick={clearFilters}>Réinitialiser</button>
									</div>
								) : (
									<div className="box-grid-tours wow fadeIn">
										<div className="row">
											{paginated.map((r, idx) => {
												const roomSlug = slugify(r.room.name)
												const detailHref = `/hotels/${citySlug}/${r.hotel.slug}/${roomSlug}?${queryString}`
												const reserveHref = `/reserver/${r.hotel.slug}/${roomSlug}?${queryString}`
												const photo = r.room.photoUrl || r.hotel.coverUrl || '/assets/imgs/page/property/banner2.png'
												return (
													<div className="col-xl-4 col-lg-6 col-md-6" key={`${r.hotel.hotelId}-${r.room._id}-${idx}`}>
														<div className="card-journey-small background-card">
															<div className="card-image">
																{r.hotel.canalTag && <Link className="label" href={detailHref}>{r.hotel.canalTag}</Link>}
																<Link className="wish" href={detailHref}>
																	<svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
																		<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
																	</svg>
																</Link>
																<Link href={detailHref}>
																	<img src={photo} alt={r.room.name} />
																</Link>
															</div>
															<div className="card-info">
																<div className="card-rating">
																	<div className="card-left"> </div>
																	<div className="card-right">
																		<span className="rating">
																			{r.hotel.avgRating > 0 ? r.hotel.avgRating.toFixed(1) : '—'}
																			{' '}<span className="text-sm-medium neutral-500">({r.hotel.reviewCount} avis)</span>
																		</span>
																	</div>
																</div>
																<div className="card-title">
																	<Link className="text-lg-bold neutral-1000" href={detailHref}>{r.room.name}</Link>
																	<p className="text-sm-medium neutral-500 mt-1 mb-0">{r.hotel.name}</p>
																</div>
																<div className="card-program">
																	<div className="card-location">
																		<p className="text-location text-sm-medium neutral-500">{r.hotel.city}</p>
																		<p className="text-star">
																			{Array.from({ length: r.hotel.stars }).map((_, i) => (
																				<img key={`l${i}`} className="light-mode" src="/assets/imgs/template/icons/star-black.svg" alt="" />
																			))}
																			{Array.from({ length: r.hotel.stars }).map((_, i) => (
																				<img key={`d${i}`} className="dark-mode" src="/assets/imgs/template/icons/star-w.svg" alt="" />
																			))}
																		</p>
																	</div>
																	<div className="endtime">
																		<div className="card-price">
																			<h6 className="heading-6 neutral-1000 mb-0" style={{ whiteSpace: 'nowrap', fontSize: 20 }}>
																				{formatPrice(r.room.basePrice)}
																				<span className="text-md-medium neutral-500" style={{ fontWeight: 400, marginLeft: 4 }}>/ nuit</span>
																			</h6>
																		</div>
																		<div className="card-button">
																			<Link className="btn btn-gray" href={reserveHref}>Réserver</Link>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								)}

								<ByPagination
									handlePreviousPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
									totalPages={totalPages}
									currentPage={currentPage}
									handleNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									handlePageChange={(p: number) => setCurrentPage(p)}
								/>
							</div>

							{/* LEFT */}
							<div className="content-left">
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">Prix par nuit</h6>
											<div className="box-collapse scrollFilter" style={{ padding: 16 }}>
												<input
													type="range"
													min={PRICE_MIN}
													max={maxPriceInRooms}
													step={5000}
													value={priceRange[0]}
													onChange={(e) => { setPriceRange([parseInt(e.target.value), priceRange[1]]); setCurrentPage(1) }}
													style={{ width: '100%' }}
												/>
												<input
													type="range"
													min={PRICE_MIN}
													max={maxPriceInRooms}
													step={5000}
													value={priceRange[1]}
													onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setCurrentPage(1) }}
													style={{ width: '100%' }}
												/>
												<div className="text-sm-medium neutral-1000 mt-2">
													{formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">Étoiles hôtel</h6>
											<div className="box-collapse scrollFilter">
												<ul className="list-filter-checkbox">
													{uniqueStars.length === 0 && <li className="text-sm neutral-500">Aucun</li>}
													{uniqueStars.map((s) => (
														<li key={s}>
															<label className="cb-container">
																<input type="checkbox" checked={selectedStars.includes(s)} onChange={() => toggleStar(s)} />
																{s} étoile{s > 1 ? 's' : ''}
																<span className="checkmark" />
															</label>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>

								{uniqueTags.length > 0 && (
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">Mises en avant</h6>
												<div className="box-collapse scrollFilter">
													<ul className="list-filter-checkbox">
														{uniqueTags.map((t) => (
															<li key={t}>
																<label className="cb-container">
																	<input type="checkbox" checked={selectedTags.includes(t)} onChange={() => toggleTag(t)} />
																	{t}
																	<span className="checkmark" />
																</label>
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	)
}
