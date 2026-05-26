import Link from 'next/link'
import type { CanalHotel } from '@/lib/ota'

const FALLBACK_IMG = '/assets/imgs/page/homepage1/journey1.png'

const COUNTRY_NAMES: Record<string, string> = {
	CM: 'Cameroun',
	FR: 'France',
	CI: "Côte d'Ivoire",
	SN: 'Sénégal',
	GA: 'Gabon',
	CG: 'Congo',
	BE: 'Belgique',
}

function normalizeCountry(code: string): string {
	if (!code) return ''
	const trimmed = code.trim()
	if (trimmed.length === 2) return COUNTRY_NAMES[trimmed.toUpperCase()] ?? trimmed
	return trimmed
}

function formatPrice(amount: number): string {
	return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF'
}

export default function CanalHotelCard({ hotel }: { hotel: CanalHotel }) {
	const href = `/hotel-detail/${hotel.slug}`
	const stars = Math.max(0, Math.min(5, Math.round(hotel.stars ?? 0)))

	return (
		<div className="card-journey-small background-card">
			<div className="card-image">
				{(hotel.featured || hotel.canalTag) && (
					<Link className="label" href={href}>{hotel.canalTag || 'Featured'}</Link>
				)}
				<Link className="wish" href="#">
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
						<span className="rating">
							{hotel.avgRating.toFixed(1)}
							{hotel.reviewCount > 0 && (
								<span className="text-sm-medium neutral-500"> ({hotel.reviewCount} avis)</span>
							)}
						</span>
					</div>
				</div>
				<div className="card-title">
					<Link className="text-lg-bold neutral-1000" href={href}>{hotel.name}</Link>
				</div>
				<div className="card-program">
					<div className="card-location">
						<p className="text-location text-sm-medium neutral-500">
							{(() => {
								const country = normalizeCountry(hotel.country)
								return country ? `${hotel.city}, ${country}` : hotel.city
							})()}
						</p>
						<p className="text-star">
							{Array.from({ length: stars }).map((_, i) => (
								<img key={`l-${i}`} className="light-mode" src="/assets/imgs/template/icons/star-black.svg" alt="" />
							))}
							{Array.from({ length: stars }).map((_, i) => (
								<img key={`d-${i}`} className="dark-mode" src="/assets/imgs/template/icons/star-w.svg" alt="" />
							))}
						</p>
					</div>
					<div className="endtime">
						<div className="card-price" style={{ whiteSpace: 'nowrap' }}>
							<h6 className="neutral-1000 mb-0" style={{ fontSize: '18px', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatPrice(hotel.lowestCanalPrice)}</h6>
							<p className="text-sm-medium neutral-500" style={{ whiteSpace: 'nowrap' }}>/ nuit</p>
						</div>
						<div className="card-button">
							<Link className="btn btn-gray" href={href}>Réserver</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
