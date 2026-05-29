'use client'
import Link from 'next/link'
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

type FiltersLabels = {
	price: string
	type: string
	amenities: string
	roomStyle: string
	reviewScore: string
	location: string
}

const DEFAULT_LABELS: FiltersLabels = {
	price: 'Prix',
	type: "Type d'hôtel",
	amenities: 'Équipements',
	roomStyle: 'Style de chambre',
	reviewScore: 'Note',
	location: 'Localisation',
}

export default function CagegoryFilter2({ labels = DEFAULT_LABELS }: { labels?: FiltersLabels }) {
	return (
		<>
			<div className="d-flex align-items-center justify-content-center popular-categories">
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.price}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Moins de 25 000 XAF</Link></li>
						<li><Link className="dropdown-item" href="#">25 000 – 75 000 XAF</Link></li>
						<li><Link className="dropdown-item" href="#">75 000 – 150 000 XAF</Link></li>
						<li><Link className="dropdown-item" href="#">Plus de 150 000 XAF</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.type}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Hôtel</Link></li>
						<li><Link className="dropdown-item" href="#">Appart-hôtel</Link></li>
						<li><Link className="dropdown-item" href="#">Résidence</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>Catégories</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Affaires</Link></li>
						<li><Link className="dropdown-item" href="#">Famille</Link></li>
						<li><Link className="dropdown-item" href="#">Luxe</Link></li>
						<li><Link className="dropdown-item" href="#">Plage</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.amenities}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Wi-Fi gratuit</Link></li>
						<li><Link className="dropdown-item" href="#">Piscine</Link></li>
						<li><Link className="dropdown-item" href="#">Petit-déjeuner inclus</Link></li>
						<li><Link className="dropdown-item" href="#">Parking</Link></li>
						<li><Link className="dropdown-item" href="#">Climatisation</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.roomStyle}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Standard</Link></li>
						<li><Link className="dropdown-item" href="#">Supérieure</Link></li>
						<li><Link className="dropdown-item" href="#">Suite</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.reviewScore}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">9+ Exceptionnel</Link></li>
						<li><Link className="dropdown-item" href="#">8+ Superbe</Link></li>
						<li><Link className="dropdown-item" href="#">7+ Très bien</Link></li>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="dropdown dropdown-filter">
					<Dropdown.Toggle className="btn btn-dropdown dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><span>{labels.location}</span></Dropdown.Toggle>
					<Dropdown.Menu as="ul" className="dropdown-menu dropdown-menu-light" style={{ margin: 0 }}>
						<li><Link className="dropdown-item active" href="#">Douala</Link></li>
						<li><Link className="dropdown-item" href="#">Yaoundé</Link></li>
						<li><Link className="dropdown-item" href="#">Kribi</Link></li>
						<li><Link className="dropdown-item" href="#">Limbé</Link></li>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</>
	)
}
