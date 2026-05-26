'use client'
import Link from 'next/link'
import { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
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
									<li><Link href="/">Home</Link></li>
									<li><Link href="/tour-grid">Tours</Link></li>
									<li><Link href="/destination">Destinations</Link></li>
									<li><Link href="/activities">Activities</Link></li>
									<li><Link href="/hotel-grid">Hotel</Link></li>
									<li><Link href="/rental-property">Apartment</Link></li>
									<li><Link href="/rental-car">Car rental</Link></li>
									<li><Link href="/tickets">Transport</Link></li>
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
