'use client'
import { useSiteContent } from '@/lib/site-context'
import Link from 'next/link'

export default function Footer1() {
    const { footer } = useSiteContent()
    const email = footer?.email || 'contact@wenagoo.com'
    const phone = footer?.phone || ''
    const whatsapp = footer?.whatsapp || ''
    const address = footer?.address || 'Bègles, France · Douala, Cameroun'

    return (
        <>
            {/* Pourquoi Wenagoo — global, visible sur toutes les pages */}
            <section className="section-box background-body py-90">
                <div className="container">
                    <div className="text-center mb-50">
                        <h2 className="neutral-1000 wow fadeInUp">Pourquoi choisir Wenagoo ?</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 mb-30">
                            <div className="d-flex gap-3 wow fadeInUp">
                                <div style={{ fontSize: 32, flexShrink: 0 }}>✓</div>
                                <div>
                                    <h6 className="neutral-1000 mb-10">Hôtels vérifiés un par un</h6>
                                    <p className="text-md neutral-500 mb-0">Chaque hôtel du réseau a été visité et validé. Pas d'annonces fantômes, pas de mauvaises surprises.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-30">
                            <div className="d-flex gap-3 wow fadeInUp">
                                <div style={{ fontSize: 32, flexShrink: 0 }}>💵</div>
                                <div>
                                    <h6 className="neutral-1000 mb-10">Prix en FCFA, sans frais cachés</h6>
                                    <p className="text-md neutral-500 mb-0">Le prix affiché est le prix payé. Pas de conversion douteuse, pas de supplément à l'arrivée.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-30">
                            <div className="d-flex gap-3 wow fadeInUp">
                                <div style={{ fontSize: 32, flexShrink: 0 }}>📱</div>
                                <div>
                                    <h6 className="neutral-1000 mb-10">Paiement Mobile Money sécurisé</h6>
                                    <p className="text-md neutral-500 mb-0">MTN MoMo, Orange Money, ou carte. Votre paiement est protégé jusqu'à votre arrivée.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-30">
                            <div className="d-flex gap-3 wow fadeInUp">
                                <div style={{ fontSize: 32, flexShrink: 0 }}>💬</div>
                                <div>
                                    <h6 className="neutral-1000 mb-10">Support 24/7 par WhatsApp</h6>
                                    <p className="text-md neutral-500 mb-0">Un problème, une question ? On vous répond sur WhatsApp, en français, immédiatement.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA hôteliers — global */}
            <section className="section-box pb-90">
                <div className="container">
                    <div className="p-40 wow fadeInUp" style={{ background: 'rgba(63, 143, 206, 0.08)', borderRadius: 12 }}>
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h5 className="neutral-1000 mb-10">Vous êtes hôtelier ?</h5>
                                <p className="text-md neutral-500 mb-0">Rejoignez le réseau Wenagoo et recevez des réservations directes, sans commission OTA.</p>
                            </div>
                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                <Link href="/become-expert" className="btn btn-brand-secondary">En savoir plus →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bande d'images lifestyle */}
            <section className="section-box box-media background-body">
                <div className="container-media wow fadeInUp">
                    <img src="/assets/imgs/page/homepage5/media.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media2.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media3.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media4.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media5.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media6.png" alt="Wenagoo" />
                    <img src="/assets/imgs/page/homepage5/media7.png" alt="Wenagoo" />
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="row align-items-center">
                            <div className="col-md-4 text-center text-md-start">
                                <Link className="d-inline-block" href="/" style={{ textDecoration: 'none' }}>
                                    <span style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--primary, #3F8FCE)' }}>wenagoo</span>
                                </Link>
                                <p className="text-md neutral-400 mt-10 mb-0">Le réseau privé d'hôtels d'Afrique centrale.</p>
                            </div>
                            <div className="col-md-8 text-center text-md-end">
                                {whatsapp ? (
                                    <div className="d-flex align-items-center justify-content-center justify-content-md-end">
                                        <Link className="text-md-medium need-help" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}>Besoin d'aide ? WhatsApp</Link>
                                        <Link className="heading-6 phone-support" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}>{whatsapp}</Link>
                                    </div>
                                ) : (
                                    <p className="text-md-medium neutral-400 mb-0">Support WhatsApp à venir</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 footer-1">
                            <h6>Contact</h6>
                            <div className="mt-20 mb-20">
                                <div className="box-info-contact">
                                    <p className="text-md neutral-400 icon-address">{address}</p>
                                    <p className="text-md neutral-400 icon-email">{email}</p>
                                    {phone && phone !== whatsapp && (
                                        <p className="text-md neutral-400 icon-worktime">{phone}</p>
                                    )}
                                </div>
                                {footer?.socials && footer.socials.length > 0 && (
                                    <>
                                        <p className="text-lg-bold title-follow neutral-0">Suivez-nous</p>
                                        <div className="box-socials-footer">
                                            {footer.socials.map((s) => (
                                                <Link key={s.url} className={`icon-socials icon-${s.platform}`} href={s.url}>
                                                    <span className="visually-hidden">{s.platform}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3 col-xs-6 footer-2">
                            <h6 className="text-linear-3">Voyageurs</h6>
                            <ul className="menu-footer">
                                <li><Link href="/hotels">Rechercher un hôtel</Link></li>
                                <li><Link href="/hotels#how-it-works">Comment ça marche</Link></li>
                                <li><Link href="/term">Conditions de réservation</Link></li>
                                <li><Link href="/privacy">Politique d'annulation</Link></li>
                                <li><Link href="/help-center">Aide & contact</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-xs-6 footer-3">
                            <h6 className="text-linear-3">Hôteliers</h6>
                            <ul className="menu-footer">
                                <li><Link href="/become-expert">Devenir partenaire</Link></li>
                                <li><Link href="https://honelia.com" target="_blank" rel="noopener noreferrer">Découvrir Honelia</Link></li>
                                <li><Link href="https://app.honelia.com" target="_blank" rel="noopener noreferrer">Espace hôtelier</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-xs-6 footer-5">
                            <h6 className="text-linear-3">Wenagoo</h6>
                            <ul className="menu-footer">
                                <li><Link href="/about">À propos</Link></li>
                                <li><Link href="/blog-grid">Blog</Link></li>
                                <li><Link href="/term">Mentions légales</Link></li>
                                <li><Link href="/privacy">Politique de confidentialité</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom mt-50">
                        <div className="row">
                            <div className="col-md-8 text-md-start text-center mb-20">
                                <p className="text-sm color-white">© 2026 Wenagoo SASU · Bègles, France — Wenagoo SARL · Douala, Cameroun. Tous droits réservés.</p>
                            </div>
                            <div className="col-md-4 text-md-end text-center mb-20">
                                <ul className="menu-bottom-footer">
                                    <li><Link href="/term">CGU</Link></li>
                                    <li><Link href="/privacy">Confidentialité</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
