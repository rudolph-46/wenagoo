'use client'
import CurrencyDropdown from '@/components/elements/CurrencyDropdown'
import LanguageDropdown from '@/components/elements/LanguageDropdown'
import { hrefForCode, useNavItems } from '@/lib/nav-context'
import dynamic from 'next/dynamic'
import Link from 'next/link'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})

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

export default function Header1({ scroll, handleLogin, handleMobileMenu, handleRegister, handleSidebar }: any) {
	const navItems = useNavItems()
	const items = navItems && navItems.length > 0 ? navItems : DEFAULT_NAV
	return (
		<>
			<header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
				<div className="top-bar">
					<div className="container-fluid">
						<div className="text-header">
							<div className="text-unlock text-sm-bold">Unlock the Magic of Travel with Wenagoo - Your Gateway to Extraordinary Experiences</div>
							<Link className="link-secondary-2" href="#">Get This Now
								<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
									<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
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
									{items.map((it, i) => (
										<li key={it.code}>
											<Link className={i === 0 ? "active" : ""} href={hrefForCode(it.code)}>
												{it.label}
											</Link>
										</li>
									))}
									<li><Link href="/contact">Contact</Link></li>
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
