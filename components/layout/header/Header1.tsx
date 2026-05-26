'use client'
import CurrencyDropdown from '@/components/elements/CurrencyDropdown'
import LanguageDropdown from '@/components/elements/LanguageDropdown'
import dynamic from 'next/dynamic'
import Link from 'next/link'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})
export default function Header1({ scroll, handleLogin, handleMobileMenu, handleRegister, handleSidebar }: any) {
	return (
		<>
			<header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
				<div className="container-fluid background-body">
					<div className="main-header">
						<div className="header-left">
							<div className="header-logo">
								<Link className="d-flex align-items-center" href="/" style={{ textDecoration: 'none' }}>
									<span style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--primary, #3F8FCE)' }}>wenagoo</span>
								</Link>
							</div>
							<div className="header-nav">
								<nav className="nav-main-menu">
									<ul className="main-menu">
										<li><Link className="active" href="/">Home</Link></li>
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
						<div className="header-right">
							<LanguageDropdown />
							<CurrencyDropdown />
							<div className="d-none d-xxl-inline-block align-middle mr-15">
								<ThemeSwitch />
								<a className="btn btn-default btn-signin" onClick={handleLogin}>Signin</a>
							</div>
							<div className="burger-icon-2 burger-icon-white" onClick={handleSidebar}>
								<img src="/assets/imgs/template/icons/menu.svg" alt="wenagoo" />
							</div>
							<div className="burger-icon burger-icon-white" onClick={handleMobileMenu}>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
