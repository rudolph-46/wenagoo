"use client"
import { useEffect, useMemo, useState } from "react"
import Layout from "@/components/layout/Layout"
import type { HotelDetail, RoomTypeDetail } from "@/lib/ota"
import { slugify } from "@/lib/slug"
import { createReservation } from "@/app/actions/createReservation"
import Link from "next/link"
import confetti from "canvas-confetti"

type Props = {
	hotel: HotelDetail["hotel"]
	room: RoomTypeDetail
	defaultCheckIn: string
	defaultCheckOut: string
	defaultTravelers: string
}

function formatPrice(amount: number): string {
	return new Intl.NumberFormat("fr-FR").format(amount) + " XAF"
}

function diffNights(checkIn: string, checkOut: string): number {
	const a = new Date(checkIn).getTime()
	const b = new Date(checkOut).getTime()
	if (!a || !b || b <= a) return 0
	return Math.ceil((b - a) / (1000 * 60 * 60 * 24))
}

export default function ReserverClient({ hotel, room, defaultCheckIn, defaultCheckOut, defaultTravelers }: Props) {
	const [checkIn, setCheckIn] = useState(defaultCheckIn)
	const [checkOut, setCheckOut] = useState(defaultCheckOut)
	const [travelers, setTravelers] = useState(defaultTravelers)

	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [phone, setPhone] = useState("")
	const [country, setCountry] = useState("CM")
	const [specialRequests, setSpecialRequests] = useState("")
	const [includeBreakfast, setIncludeBreakfast] = useState(false)
	const [includeCar, setIncludeCar] = useState(false)
	const [includeGuide, setIncludeGuide] = useState(false)

	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
	const [error, setError] = useState("")
	const [result, setResult] = useState<{ confirmationCode: string; totalAmount: number } | null>(null)

	// Confetti burst on success
	useEffect(() => {
		if (status !== "sent") return
		const duration = 2500
		const end = Date.now() + duration
		const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#3F8FCE", "#A78BFA", "#34D399"]
		const frame = () => {
			confetti({
				particleCount: 4,
				angle: 60,
				spread: 70,
				origin: { x: 0, y: 0.7 },
				colors,
			})
			confetti({
				particleCount: 4,
				angle: 120,
				spread: 70,
				origin: { x: 1, y: 0.7 },
				colors,
			})
			if (Date.now() < end) requestAnimationFrame(frame)
		}
		// Initial big burst from center
		confetti({
			particleCount: 180,
			spread: 100,
			startVelocity: 50,
			origin: { x: 0.5, y: 0.4 },
			colors,
		})
		requestAnimationFrame(frame)
	}, [status])

	const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut])
	const travelersN = parseInt(travelers, 10) || 1

	// Extras (prix par défaut, l'hôtel ajuste si besoin)
	const BREAKFAST_PRICE_PER_PERSON_PER_NIGHT = 5000
	const CAR_PRICE_PER_DAY = 15000
	const GUIDE_PRICE_PER_DAY = 25000
	const breakfastTotal = includeBreakfast ? BREAKFAST_PRICE_PER_PERSON_PER_NIGHT * travelersN * nights : 0
	const carTotal = includeCar ? CAR_PRICE_PER_DAY * nights : 0
	const guideTotal = includeGuide ? GUIDE_PRICE_PER_DAY * nights : 0
	const extrasTotal = breakfastTotal + carTotal + guideTotal

	const roomSubtotal = room.basePrice * nights
	const subtotal = roomSubtotal + extrasTotal
	const heroImage = room.photoUrls?.[0] || hotel.coverUrl || "/assets/imgs/page/property/banner2.png"
	const citySlug = slugify(hotel.address?.city || "")
	const roomDetailHref = citySlug ? `/hotels/${citySlug}/${hotel.slug}/${slugify(room.name)}` : "/"

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setStatus("sending")
		setError("")

		// Synthetic email from phone (the hotel will reach out via WhatsApp)
		const digits = phone.replace(/\D/g, "")
		const syntheticEmail = `${digits || "anonymous"}@whatsapp.wenagoo.local`

		// Build structured services block appended to specialRequests
		const services: string[] = []
		if (includeBreakfast) services.push(`• Petit-déjeuner inclus (${formatPrice(breakfastTotal)})`)
		if (includeCar) services.push(`• Voiture pour les déplacements (${formatPrice(carTotal)})`)
		if (includeGuide) services.push(`• Guide spécial (${formatPrice(guideTotal)})`)
		const blocks: string[] = []
		if (services.length > 0) {
			blocks.push(`Services demandés :\n${services.join("\n")}\nTotal services estimé : ${formatPrice(extrasTotal)}`)
		}
		if (country) blocks.push(`Pays d'origine : ${country}`)
		if (specialRequests.trim()) blocks.push(`Demandes spéciales :\n${specialRequests.trim()}`)
		const composedSpecialRequests = blocks.length > 0 ? blocks.join("\n\n") : undefined

		const res = await createReservation({
			hotelId: hotel._id,
			roomTypeId: room._id,
			checkInDate: checkIn,
			checkOutDate: checkOut,
			adults: travelersN,
			guestFirstName: firstName,
			guestLastName: lastName,
			guestEmail: syntheticEmail,
			guestPhone: phone,
			guestCountry: country || undefined,
			specialRequests: composedSpecialRequests,
		})
		if (res.ok) {
			setStatus("sent")
			setResult({ confirmationCode: res.confirmationCode, totalAmount: res.totalAmount })
		} else {
			setStatus("error")
			setError(res.error)
		}
	}

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				<section className="box-section box-breadcrumb background-body">
					<div className="container">
						<ul className="breadcrumbs">
							<li><Link href="/">Accueil</Link><span className="arrow-right">›</span></li>
							<li><Link href="/hotels">Hôtels</Link><span className="arrow-right">›</span></li>
							{hotel.address?.city && (
								<li><Link href={`/hotels/${citySlug}`}>{hotel.address.city}</Link><span className="arrow-right">›</span></li>
							)}
							<li><Link href={roomDetailHref}>{room.name}</Link><span className="arrow-right">›</span></li>
							<li><span>Réservation</span></li>
						</ul>
					</div>
				</section>

				<section className="section-box background-body" style={{ paddingTop: 40, paddingBottom: 80 }}>
					<div className="container">
						{status === "sent" && result ? (
							<div className="row justify-content-center">
								<div className="col-lg-7">
									<div className="background-card" style={{ padding: 40, borderRadius: 16, textAlign: "center" }}>
										<div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
										<h3 className="neutral-1000 mb-10">Réservation enregistrée !</h3>
										<p className="text-lg-medium neutral-500 mb-30">
											L&apos;hôtel a été notifié et vous contactera très rapidement pour confirmer.
										</p>
										<div style={{ background: "#F3F4F6", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "left" }}>
											<div className="d-flex justify-content-between align-items-center mb-15">
												<span className="text-sm-medium neutral-500">Code de confirmation</span>
												<span className="text-xl-bold neutral-1000" style={{ letterSpacing: 1.5 }}>{result.confirmationCode}</span>
											</div>
											<div className="d-flex justify-content-between align-items-center mb-15">
												<span className="text-sm-medium neutral-500">Hôtel</span>
												<span className="text-md-bold neutral-1000">{hotel.name}</span>
											</div>
											<div className="d-flex justify-content-between align-items-center mb-15">
												<span className="text-sm-medium neutral-500">Chambre</span>
												<span className="text-md-bold neutral-1000">{room.name}</span>
											</div>
											<div className="d-flex justify-content-between align-items-center mb-15">
												<span className="text-sm-medium neutral-500">Séjour</span>
												<span className="text-md-bold neutral-1000">{checkIn} → {checkOut} ({nights} nuit{nights > 1 ? "s" : ""})</span>
											</div>
											<div className="d-flex justify-content-between align-items-center" style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12, marginTop: 4 }}>
												<span className="text-md-bold neutral-1000">Total estimé</span>
												<span className="text-xl-bold neutral-1000">{formatPrice(result.totalAmount)}</span>
											</div>
										</div>
										<div className="d-flex justify-content-center gap-2">
											<Link href={roomDetailHref} className="btn btn-default">Retour à la chambre</Link>
											<Link href="/hotels" className="btn btn-black-lg-square">Découvrir d&apos;autres hôtels</Link>
										</div>
									</div>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								<div className="row">
									{/* Left: form */}
									<div className="col-lg-7 mb-30">
										<div className="background-card" style={{ padding: 32, borderRadius: 16 }}>
											<h5 className="neutral-1000 mb-20">Détails du séjour</h5>
											<div className="row mb-20">
												<div className="col-md-4 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Arrivée *</label>
													<input className="form-control" type="date" value={checkIn} min={defaultCheckIn} onChange={(e) => setCheckIn(e.target.value)} required />
												</div>
												<div className="col-md-4 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Départ *</label>
													<input className="form-control" type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} required />
												</div>
												<div className="col-md-4 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Voyageurs *</label>
													<select className="form-control" value={travelers} onChange={(e) => setTravelers(e.target.value)}>
														<option value="1">1 voyageur</option>
														<option value="2">2 voyageurs</option>
														<option value="3">3 voyageurs</option>
														<option value="4">4 voyageurs</option>
													</select>
												</div>
											</div>

											<h5 className="neutral-1000 mb-20" style={{ borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>Vos coordonnées</h5>
											<div className="row">
												<div className="col-md-6 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Prénom *</label>
													<input className="form-control" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
												</div>
												<div className="col-md-6 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Nom *</label>
													<input className="form-control" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
												</div>
												<div className="col-md-6 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Pays d&apos;origine *</label>
													<select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required>
														<option value="CM">🇨🇲 Cameroun</option>
														<option value="GA">🇬🇦 Gabon</option>
														<option value="CG">🇨🇬 Congo</option>
														<option value="CD">🇨🇩 RDC</option>
														<option value="CF">🇨🇫 Centrafrique</option>
														<option value="TD">🇹🇩 Tchad</option>
														<option value="GQ">🇬🇶 Guinée équatoriale</option>
														<option value="NG">🇳🇬 Nigeria</option>
														<option value="CI">🇨🇮 Côte d&apos;Ivoire</option>
														<option value="SN">🇸🇳 Sénégal</option>
														<option value="MA">🇲🇦 Maroc</option>
														<option value="FR">🇫🇷 France</option>
														<option value="BE">🇧🇪 Belgique</option>
														<option value="CH">🇨🇭 Suisse</option>
														<option value="CA">🇨🇦 Canada</option>
														<option value="US">🇺🇸 États-Unis</option>
														<option value="GB">🇬🇧 Royaume-Uni</option>
														<option value="DE">🇩🇪 Allemagne</option>
														<option value="OTHER">Autre</option>
													</select>
												</div>
												<div className="col-md-6 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">WhatsApp *</label>
													<input className="form-control" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6XX XX XX XX" required />
												</div>
											</div>

											<h5 className="neutral-1000 mb-20" style={{ borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>Services additionnels</h5>
											<p className="text-sm neutral-500 mb-15">Optionnel. Le prix est ajouté au sous-total et confirmé par l&apos;hôtel.</p>
											<div className="d-flex flex-column" style={{ gap: 12, marginBottom: 16 }}>
												<label className="d-flex align-items-center" style={{ gap: 12, padding: "12px 16px", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", background: includeBreakfast ? "#F9FAFB" : "#fff" }}>
													<input type="checkbox" checked={includeBreakfast} onChange={(e) => setIncludeBreakfast(e.target.checked)} style={{ width: 18, height: 18 }} />
													<div style={{ flex: 1 }}>
														<p className="text-md-bold neutral-1000 mb-0">🥐 Inclure le petit-déjeuner</p>
														<p className="text-sm neutral-500 mb-0">{formatPrice(BREAKFAST_PRICE_PER_PERSON_PER_NIGHT)} / personne / nuit</p>
													</div>
													{includeBreakfast && <span className="text-md-bold neutral-1000">{formatPrice(breakfastTotal)}</span>}
												</label>
												<label className="d-flex align-items-center" style={{ gap: 12, padding: "12px 16px", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", background: includeCar ? "#F9FAFB" : "#fff" }}>
													<input type="checkbox" checked={includeCar} onChange={(e) => setIncludeCar(e.target.checked)} style={{ width: 18, height: 18 }} />
													<div style={{ flex: 1 }}>
														<p className="text-md-bold neutral-1000 mb-0">🚗 Voiture pour me déplacer</p>
														<p className="text-sm neutral-500 mb-0">{formatPrice(CAR_PRICE_PER_DAY)} / jour</p>
													</div>
													{includeCar && <span className="text-md-bold neutral-1000">{formatPrice(carTotal)}</span>}
												</label>
												<label className="d-flex align-items-center" style={{ gap: 12, padding: "12px 16px", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", background: includeGuide ? "#F9FAFB" : "#fff" }}>
													<input type="checkbox" checked={includeGuide} onChange={(e) => setIncludeGuide(e.target.checked)} style={{ width: 18, height: 18 }} />
													<div style={{ flex: 1 }}>
														<p className="text-md-bold neutral-1000 mb-0">🧭 Guide spécial</p>
														<p className="text-sm neutral-500 mb-0">{formatPrice(GUIDE_PRICE_PER_DAY)} / jour</p>
													</div>
													{includeGuide && <span className="text-md-bold neutral-1000">{formatPrice(guideTotal)}</span>}
												</label>
											</div>

											<div className="row">
												<div className="col-12 mb-3">
													<label className="text-sm-medium neutral-1000 mb-1 d-block">Demandes spéciales (optionnel)</label>
													<textarea className="form-control" rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Lit bébé, étage élevé, allergies…" />
												</div>
											</div>

											{status === "error" && (
												<p className="text-sm-medium mb-3" style={{ color: "#b91c1c" }}>{error || "Erreur lors de la réservation."}</p>
											)}

											<button type="submit" className="btn btn-black-lg-square w-100" disabled={status === "sending" || nights < 1}>
												{status === "sending" ? "Envoi en cours…" : "Confirmer la réservation"}
												<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
													<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<p className="text-sm neutral-500 text-center mt-2 mb-0">Aucun paiement. Payer à votre arrivée à l&apos;hôtel.</p>
										</div>
									</div>

									{/* Right: recap */}
									<div className="col-lg-5">
										<div className="background-card" style={{ padding: 0, borderRadius: 16, overflow: "hidden", position: "sticky", top: 100 }}>
											<img src={heroImage} alt={room.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
											<div style={{ padding: 24 }}>
												<p className="text-sm-medium neutral-500 mb-5">{hotel.name}</p>
												<h5 className="neutral-1000 mb-10">{room.name}</h5>
												<p className="text-sm neutral-500 mb-15">
													{room.size ? `${room.size} m² · ` : ""}{room.maxOccupancy} pers. · {room.beds.reduce((n, b) => n + (b.count || 1), 0)} lit(s)
												</p>
												{hotel.address?.city && (
													<p className="text-sm neutral-500 mb-20">
														📍 {[hotel.address.street, hotel.address.city, hotel.address.country].filter(Boolean).join(", ")}
													</p>
												)}

												<div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, marginBottom: 8 }}>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Arrivée</span>
														<span className="text-sm-bold neutral-1000">{checkIn || "—"}</span>
													</div>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Départ</span>
														<span className="text-sm-bold neutral-1000">{checkOut || "—"}</span>
													</div>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Voyageurs</span>
														<span className="text-sm-bold neutral-1000">{travelers}</span>
													</div>
												</div>

												<div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16 }}>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">{formatPrice(room.basePrice)} × {nights} nuit{nights > 1 ? "s" : ""}</span>
														<span className="text-sm-bold neutral-1000">{formatPrice(roomSubtotal)}</span>
													</div>
													{includeBreakfast && (
														<div className="d-flex justify-content-between mb-2">
															<span className="text-sm-medium neutral-500">🥐 Petit-déjeuner</span>
															<span className="text-sm-bold neutral-1000">{formatPrice(breakfastTotal)}</span>
														</div>
													)}
													{includeCar && (
														<div className="d-flex justify-content-between mb-2">
															<span className="text-sm-medium neutral-500">🚗 Voiture</span>
															<span className="text-sm-bold neutral-1000">{formatPrice(carTotal)}</span>
														</div>
													)}
													{includeGuide && (
														<div className="d-flex justify-content-between mb-2">
															<span className="text-sm-medium neutral-500">🧭 Guide spécial</span>
															<span className="text-sm-bold neutral-1000">{formatPrice(guideTotal)}</span>
														</div>
													)}
													<p className="text-sm neutral-500 mb-15" style={{ fontStyle: "italic" }}>Taxes et frais calculés par l&apos;hôtel</p>
													<div className="d-flex justify-content-between align-items-center" style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12 }}>
														<span className="text-md-bold neutral-1000">Sous-total</span>
														<span className="text-xl-bold neutral-1000">{formatPrice(subtotal)}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
						)}
					</div>
				</section>
			</main>
		</Layout>
	)
}
