'use client'
import Link from 'next/link'
import type { CanalHotel } from '@/lib/ota'
import { slugify } from '@/lib/slug'

const FALLBACK_IMG = '/assets/imgs/page/homepage1/journey1.png'

function formatPrice(amount: number): string {
	return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF'
}

export default function CanalHotelCard({
	hotel,
}: {
	hotel: CanalHotel
	isCheapest?: boolean
}) {
	const citySlug = slugify(hotel.city || "")
	const href = citySlug ? `/hotels/${citySlug}/${hotel.slug}` : `/hotels`
	const hasReviews = hotel.reviewCount > 0

	return (
		<div className="card-journey-small background-card">
			<div className="card-image" style={{ height: 261 }}>
				{(hotel.featured || hotel.canalTag) && (
					<Link className="label" href={href}>{hotel.canalTag || 'Featured'}</Link>
				)}
				{hotel.discount > 0 && (
					<Link className="label saleoff" href={href}>-{hotel.discount}%</Link>
				)}
				<Link className="wish" href="#" onClick={(e) => e.preventDefault()}>
					<svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
						<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
					</svg>
				</Link>
				<Link href={href}>
					<img src={hotel.coverUrl ?? FALLBACK_IMG} alt={hotel.name} />
				</Link>
			</div>
			<div className="card-info">
				<div className="card-rating">
					<div className="card-left"> </div>
					<div className="card-right">
						{hasReviews ? (
							<span className="rating">
								{hotel.avgRating.toFixed(1)}
								<span className="text-sm-medium neutral-500"> {hotel.ratingLabel} · ({hotel.reviewCount} avis)</span>
							</span>
						) : (
							<span className="rating">Nouveau</span>
						)}
					</div>
				</div>
				<div className="card-title">
					<Link className="text-lg-bold neutral-1000" href={href}>{hotel.name}</Link>
				</div>
				<div className="card-program">
					<div className="card-duration-tour">
						<p className="icon-duration text-md-medium neutral-500">1 nuit min.</p>
						<p className="icon-guest text-md-medium neutral-500">2 pers.</p>
					</div>
					<div className="endtime">
						<div className="card-price" style={{ whiteSpace: 'nowrap' }}>
							<h6 className="neutral-1000 mb-0" style={{ fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap' }}>
								{formatPrice(hotel.lowestCanalPrice)}
							</h6>
							<p className="text-sm-medium neutral-500 mb-0" style={{ whiteSpace: 'nowrap' }}>/ nuit</p>
						</div>
						<div className="card-button">
							<Link className="btn btn-gray" href={href} style={{ whiteSpace: 'nowrap' }}>Réserver</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
