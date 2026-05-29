'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dropdown from 'react-bootstrap/Dropdown'

type City = { slug: string; name: string }

type Props = {
	miniField?: boolean
	cities?: City[]
	initialCity?: string | null
	initialCheckIn?: string
	initialCheckOut?: string
	initialAdults?: number
	initialChildren?: number
}

function toISO(d: Date): string {
	return d.toISOString().slice(0, 10)
}

function formatLabel(iso: string): string {
	if (!iso) return ''
	const [y, m, d] = iso.split('-')
	return `${d}/${m}/${y}`
}

export default function SearchFilterBottom({
	miniField,
	cities = [],
	initialCity = null,
	initialCheckIn,
	initialCheckOut,
	initialAdults = 2,
	initialChildren = 0,
}: Props) {
	const router = useRouter()

	const todayISO = toISO(new Date())
	const tomorrowISO = toISO(new Date(Date.now() + 24 * 60 * 60 * 1000))

	const [city, setCity] = useState<string | null>(initialCity ?? null)
	const [checkIn, setCheckIn] = useState<string>(initialCheckIn ?? todayISO)
	const [checkOut, setCheckOut] = useState<string>(initialCheckOut ?? tomorrowISO)
	const [adults, setAdults] = useState<number>(initialAdults ?? 2)
	const [childrenCount, setChildrenCount] = useState<number>(initialChildren ?? 0)

	// Auto-fix checkOut when checkIn moves past it
	useEffect(() => {
		if (checkOut <= checkIn) {
			const next = new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
			setCheckOut(toISO(next))
		}
	}, [checkIn, checkOut])

	const cityLabel = city ? (cities.find((c) => c.slug === city)?.name ?? city) : 'Choisir une ville'
	const guestsLabel = `${adults} adulte${adults > 1 ? 's' : ''}${childrenCount > 0 ? `, ${childrenCount} enfant${childrenCount > 1 ? 's' : ''}` : ''}`

	function handleSearch() {
		const target = city ? `/hotels/${city}` : '/hotels'
		const params = new URLSearchParams()
		if (checkIn) params.set('checkIn', checkIn)
		if (checkOut) params.set('checkOut', checkOut)
		if (adults) params.set('adults', String(adults))
		if (childrenCount > 0) params.set('children', String(childrenCount))
		router.push(`${target}?${params.toString()}`)
	}

	return (
		<>
			<div className="box-bottom-search background-card">
				{!miniField && (
					<div className="item-search">
						<label className="text-sm-bold neutral-500">Ville</label>
						<Dropdown className="dropdown">
							<Dropdown.Toggle
								className="btn btn-secondary dropdown-toggle btn-dropdown-search location-search"
								type="button"
							>
								{cityLabel}
							</Dropdown.Toggle>
							<Dropdown.Menu as="ul" className="dropdown-menu">
								<li>
									<button type="button" className="dropdown-item" onClick={() => setCity(null)}>
										Toutes les villes
									</button>
								</li>
								{cities.map((c) => (
									<li key={c.slug}>
										<button type="button" className="dropdown-item" onClick={() => setCity(c.slug)}>
											{c.name}
										</button>
									</li>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</div>
				)}
				<div className="item-search item-search-2">
					<label className="text-sm-bold neutral-500">Arrivée</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle
							className="btn btn-secondary dropdown-toggle btn-dropdown-search"
							type="button"
						>
							{formatLabel(checkIn)}
						</Dropdown.Toggle>
						<Dropdown.Menu className="dropdown-menu p-3" style={{ minWidth: 280 }}>
							<input
								type="date"
								className="form-control"
								value={checkIn}
								min={todayISO}
								onChange={(e) => setCheckIn(e.target.value)}
							/>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="item-search item-search-3">
					<label className="text-sm-bold neutral-500">Départ</label>
					<Dropdown className="dropdown">
						<Dropdown.Toggle
							className="btn btn-secondary dropdown-toggle btn-dropdown-search"
							type="button"
						>
							{formatLabel(checkOut)}
						</Dropdown.Toggle>
						<Dropdown.Menu className="dropdown-menu p-3" style={{ minWidth: 280 }}>
							<input
								type="date"
								className="form-control"
								value={checkOut}
								min={toISO(new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000))}
								onChange={(e) => setCheckOut(e.target.value)}
							/>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				{!miniField && (
					<div className="item-search bd-none">
						<label className="text-sm-bold neutral-500">Voyageurs</label>
						<Dropdown className="dropdown">
							<Dropdown.Toggle
								className="btn btn-secondary dropdown-toggle btn-dropdown-search passenger-search"
								type="button"
							>
								{guestsLabel}
							</Dropdown.Toggle>
							<Dropdown.Menu className="dropdown-menu p-3" style={{ minWidth: 280 }}>
								<div className="d-flex align-items-center justify-content-between mb-3">
									<div>
										<p className="text-sm-bold mb-0 neutral-1000">Adultes</p>
										<p className="text-xs neutral-500 mb-0">13 ans et +</p>
									</div>
									<div className="d-flex align-items-center" style={{ gap: 10 }}>
										<button type="button" className="btn btn-default px-2 py-0" onClick={() => setAdults((n) => Math.max(1, n - 1))} disabled={adults <= 1}>−</button>
										<span className="text-md-bold" style={{ minWidth: 16, textAlign: 'center' }}>{adults}</span>
										<button type="button" className="btn btn-default px-2 py-0" onClick={() => setAdults((n) => Math.min(8, n + 1))} disabled={adults >= 8}>+</button>
									</div>
								</div>
								<div className="d-flex align-items-center justify-content-between">
									<div>
										<p className="text-sm-bold mb-0 neutral-1000">Enfants</p>
										<p className="text-xs neutral-500 mb-0">0 à 12 ans</p>
									</div>
									<div className="d-flex align-items-center" style={{ gap: 10 }}>
										<button type="button" className="btn btn-default px-2 py-0" onClick={() => setChildrenCount((n) => Math.max(0, n - 1))} disabled={childrenCount <= 0}>−</button>
										<span className="text-md-bold" style={{ minWidth: 16, textAlign: 'center' }}>{childrenCount}</span>
										<button type="button" className="btn btn-default px-2 py-0" onClick={() => setChildrenCount((n) => Math.min(6, n + 1))} disabled={childrenCount >= 6}>+</button>
									</div>
								</div>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				)}
				<div className="item-search bd-none d-flex justify-content-end">
					<button type="button" className="btn btn-black-lg" onClick={handleSearch}>
						<svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
						</svg>
						Rechercher
					</button>
				</div>
			</div>
		</>
	)
}
