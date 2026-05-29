'use client'
import CurrencyDropdown from '@/components/elements/CurrencyDropdown'
import LanguageDropdown from '@/components/elements/LanguageDropdown'
import { useSiteContent } from '@/lib/site-context'
import dynamic from 'next/dynamic'
import Link from 'next/link'
const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
	ssr: false,
})

const NAV_ITEMS: Array<{ label: string; href: string }> = [
	{ label: "Hôtels", href: "/hotels" },
	{ label: "Comment ça marche", href: "/hotels#how-it-works" },
	{ label: "Contact", href: "/contact" },
]

const DEFAULT_TOP_BANNER = {
	text: "Le réseau privé d'hôtels d'Afrique centrale — accès sur invitation, paiement Mobile Money",
	ctaLabel: "Découvrir",
	ctaHref: "/hotels",
}

export default function Header1({ scroll, handleLogin, handleMobileMenu, handleRegister, handleSidebar }: any) {
	const { topBanner } = useSiteContent()
	const banner = topBanner ?? DEFAULT_TOP_BANNER
	return (
		<>
			<header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
				<div className="top-bar">
					<div className="container-fluid">
						<div className="text-header">
							<div className="text-unlock text-sm-bold">⚡ {banner.text}</div>
							{banner.ctaLabel && (
								<Link className="link-secondary-2" href={banner.ctaHref || "#"}>{banner.ctaLabel}
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
										<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className="container-fluid background-body">
					<div className="main-header">
						<div className="header-left" style={{ display: "flex", alignItems: "center", gap: 32, marginRight: "auto", justifyContent: "flex-start", width: "auto" }}>
							<div className="header-logo">
								<Link className="d-flex align-items-center" href="/" style={{ textDecoration: 'none' }}>
									<span style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--primary, #3F8FCE)' }}>wenagoo</span>
								</Link>
							</div>
							<div className="header-nav" style={{ width: "auto", textAlign: "left" }}>
								<nav className="nav-main-menu" style={{ justifyContent: "flex-start" }}>
								<ul className="main-menu" style={{ display: "flex", gap: 24, margin: 0, padding: 0, listStyle: "none" }}>
									{NAV_ITEMS.map((it, i) => (
										<li key={it.href}>
											<Link className={i === 0 ? "active" : ""} href={it.href}>
												{it.label}
											</Link>
										</li>
									))}
								</ul>
								</nav>
							</div>
						</div>
						<div className="header-right">
							<LanguageDropdown />
							<CurrencyDropdown />
							<div className="d-none d-xxl-inline-flex align-items-center mr-15" style={{ gap: 16 }}>
								<ThemeSwitch />
								<a className="btn btn-default btn-signin" onClick={handleLogin}>Se connecter</a>
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
