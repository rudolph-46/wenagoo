'use client'
import { hrefForCode, useNavItems } from '@/lib/nav-context'
import Link from 'next/link'
import { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

const DEFAULT_NAV = [
	{ code: "home", label: "Home" },
	{ code: "tours", label: "Tours" },
	{ code: "destinations", label: "Destinations" },
	{ code: "activities", label: "Activities" },
	{ code: "hotel", label: "Hotel" },
	{ code: "apartment", label: "Apartment" },
	{ code: "car-rental", label: "Car rental" },
	{ code: "transport", label: "Transport" },
]

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const navItems = useNavItems()
	const items = navItems && navItems.length > 0 ? navItems : DEFAULT_NAV
	const [isAccordion, setIsAccordion] = useState(0)

	const handleAccordion = (key: any) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	return (
		<>
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? "sidebar-visible" : ""}`}>
				<PerfectScrollbar className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo"> <Link className="d-flex align-items-center" href="/" style={{ textDecoration: 'none' }}><span style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--primary, #3F8FCE)' }}>wenagoo</span></Link>
						<div className="burger-icon burger-icon-white" onClick={handleMobileMenu} />
					</div>
					<div className="mobile-header-top">
						<div className="box-author-profile">
							<div className="card-author">
								<div className="card-image"> <img src="/assets/imgs/page/homepage1/author2.png" alt="Wenago" /></div>
								<div className="card-info">
									<p className="text-md-bold neutral-1000">Alice Roses</p>
									<p className="text-xs neutral-1000">London, England</p>
								</div>
							</div><Link className="btn btn-black" href="#">Logout</Link>
						</div>
					</div>
					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
								<ul className="mobile-menu font-heading">
									{items.map((it) => (
										<li key={it.code}><Link href={hrefForCode(it.code)}>{it.label}</Link></li>
									))}
									<li><Link href="/contact">Contact</Link></li>
								</ul>
								</nav>
							</div>
						</div>
					</div>
				</PerfectScrollbar>
			</div>

		</>
	)
}
