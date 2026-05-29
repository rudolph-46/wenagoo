"use client";
import { useState } from "react";
import VideoPopup from "@/components/elements/VideoPopup";
import Layout from "@/components/layout/Layout";
import type { CanalHotel, HotelDetail, PublicReview, PublicRoomType, RoomTypeDetail } from "@/lib/ota";
import CanalHotelCard from "@/components/elements/hotelcard/CanalHotelCard";
import { useSiteContent } from "@/lib/site-context";
import { slugify } from "@/lib/slug";
import { submitQuestion } from "@/app/actions/submitQuestion";
import Link from "next/link";

function formatPrice(amount: number): string {
    return new Intl.NumberFormat("fr-FR").format(amount) + " XAF";
}

type NearbyRoom = PublicRoomType & {
    hotelName: string
    hotelSlug: string
    hotelCity: string
}

type Props = {
    room: RoomTypeDetail
    hotel?: HotelDetail["hotel"] | null
    hotelWhatsapp?: string | null
    hotelEmail?: string | null
    otherRooms?: PublicRoomType[]
    similarRooms?: PublicRoomType[]
    nearbyRooms?: NearbyRoom[]
    nearbyHotels?: CanalHotel[]
    reviews?: PublicReview[]
    faq?: Array<{ question: string; answer: string }>
    citySlug?: string
    hotelSlug?: string
    roomSlug?: string
}

export default function RoomDetailClient({ room, hotel, hotelWhatsapp, hotelEmail, otherRooms = [], similarRooms = [], nearbyRooms = [], nearbyHotels = [], reviews = [], faq = [], citySlug, hotelSlug, roomSlug }: Props) {
    const { footer } = useSiteContent()
    const whatsapp = hotelWhatsapp || footer?.whatsapp || ""
    const email = hotelEmail || footer?.email || "contact@wenagoo.com"
    const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : "#"
    const [isAccordion, setIsAccordion] = useState<number | null>(null);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(true);
    const [questionName, setQuestionName] = useState("");
    const [questionPhone, setQuestionPhone] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [questionStatus, setQuestionStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [questionError, setQuestionError] = useState<string>("");
    const hotelIdForQuestion = hotel?._id ?? "";

    // Booking pre-fill state (passed via query string to /reserver/[hotel]/[room])
    const [bookingCheckIn, setBookingCheckIn] = useState("");
    const [bookingCheckOut, setBookingCheckOut] = useState("");
    const [bookingTravelers, setBookingTravelers] = useState("2");

    async function handleSubmitQuestion() {
        if (!hotelIdForQuestion) {
            setQuestionStatus("error");
            setQuestionError("Hôtel introuvable");
            return;
        }
        setQuestionStatus("sending");
        setQuestionError("");
        const res = await submitQuestion({
            hotelId: hotelIdForQuestion,
            roomTypeId: room._id,
            name: questionName,
            phone: questionPhone,
            question: questionText,
        });
        if (res.ok) {
            setQuestionStatus("sent");
            setQuestionName("");
            setQuestionPhone("");
            setQuestionText("");
        } else {
            setQuestionStatus("error");
            setQuestionError(res.error);
        }
    }

    const handleAccordion = (key: number) => {
        setIsAccordion((prevState) => (prevState === key ? null : key));
    };

    const FALLBACK = "/assets/imgs/page/property/banner2.png";
    // Dates par défaut : aujourd'hui et lendemain (format YYYY-MM-DD pour input[type=date])
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const toISODate = (d: Date) => d.toISOString().slice(0, 10);
    const defaultCheckIn = toISODate(today);
    const defaultCheckOut = toISODate(tomorrow);
    const hotelPhotos = (hotel?.photosUrls ?? []).filter((u): u is string => !!u);
    const fallbackChain = room.photoUrls.length > 0
        ? room.photoUrls
        : (hotelPhotos.length > 0 ? hotelPhotos : [FALLBACK]);
    const photos = fallbackChain;
    // Reviews are stored on a 0–10 scale; convert to a 0–5 scale for display.
    const toFive = (r: number) => Math.max(0, Math.min(5, r / 2));
    const avgRatingRaw = reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;
    const avgRating = toFive(avgRatingRaw);
    const reviewCount = reviews.length;
    const img1 = photos[0] || FALLBACK;
    const img2 = photos[1] || photos[0] || FALLBACK;
    const img3 = photos[2] || photos[0] || FALLBACK;
    const img4 = photos[3] || photos[0] || FALLBACK;
    const img5 = photos[4] || photos[0] || FALLBACK;
    const totalBeds = room.beds.reduce((n, b) => n + (b.count || 1), 0) || 1;

    return (
        <>
            <Layout headerStyle={1} footerStyle={1}>
                <main className="main">
                    <section className="box-section box-breadcrumb background-body">
                        <div className="container">
                            <ul className="breadcrumbs">
                                <li>
                                    <Link href="/">Accueil</Link>
                                    <span className="arrow-right">
                                        <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </span>
                                </li>
                                <li>
                                    <Link href="/hotels">Hôtels</Link>
                                    <span className="arrow-right">
                                        <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </span>
                                </li>
                                {hotel?.address?.city && (
                                    <li>
                                        <Link href={`/hotels/${slugify(hotel.address.city)}`}>{hotel.address.city}</Link>
                                        <span className="arrow-right">
                                            <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            </svg>
                                        </span>
                                    </li>
                                )}
                                <li>
                                    <Link href={`/hotels/${slugify(hotel?.address?.city || "")}/${room.hotelSlug}`}>{room.hotelName}</Link>
                                    <span className="arrow-right">
                                        <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </span>
                                </li>
                                <li>
                                    <span className="text-breadcrumb">{room.name}</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className="box-section box-banner-property-detail background-body">
                        <div className="container">
                            <div className="block-banner-property-detail container-banner-activities">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6">
                                        <div className="banner-property-detail-1">
                                            {" "}
                                            <img src={img1} alt={room.name} />
                                            <div className="box-button-abs">
                                                {" "}
                                                <Link className="btn btn-brand-secondary" href="#">
                                                    <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20 8V2.75C20 2.3375 19.6625 2 19.25 2H14C13.5875 2 13.25 2.3375 13.25 2.75V8C13.25 8.4125 13.5875 8.75 14 8.75H19.25C19.6625 8.75 20 8.4125 20 8ZM19.25 0.5C20.495 0.5 21.5 1.505 21.5 2.75V8C21.5 9.245 20.495 10.25 19.25 10.25H14C12.755 10.25 11.75 9.245 11.75 8V2.75C11.75 1.505 12.755 0.5 14 0.5H19.25Z" />
                                                        <path d="M20 19.25V14C20 13.5875 19.6625 13.25 19.25 13.25H14C13.5875 13.25 13.25 13.5875 13.25 14V19.25C13.25 19.6625 13.5875 20 14 20H19.25C19.6625 20 20 19.6625 20 19.25ZM19.25 11.75C20.495 11.75 21.5 12.755 21.5 14V19.25C21.5 20.495 20.495 21.5 19.25 21.5H14C12.755 21.5 11.75 20.495 11.75 19.25V14C11.75 12.755 12.755 11.75 14 11.75H19.25Z" />
                                                        <path d="M8 8.75C8.4125 8.75 8.75 8.4125 8.75 8V2.75C8.75 2.3375 8.4125 2 8 2H2.75C2.3375 2 2 2.3375 2 2.75V8C2 8.4125 2.3375 8.75 2.75 8.75H8ZM8 0.5C9.245 0.5 10.25 1.505 10.25 2.75V8C10.25 9.245 9.245 10.25 8 10.25H2.75C1.505 10.25 0.5 9.245 0.5 8V2.75C0.5 1.505 1.505 0.5 2.75 0.5H8Z" />
                                                        <path d="M8 20C8.4125 20 8.75 19.6625 8.75 19.25V14C8.75 13.5875 8.4125 13.25 8 13.25H2.75C2.3375 13.25 2 13.5875 2 14V19.25C2 19.6625 2.3375 20 2.75 20H8ZM8 11.75C9.245 11.75 10.25 12.755 10.25 14V19.25C10.25 20.495 9.245 21.5 8 21.5H2.75C1.505 21.5 0.5 20.495 0.5 19.25V14C0.5 12.755 1.505 11.75 2.75 11.75H8Z" />
                                                    </svg>
                                                    See All Photos
                                                </Link>
                                                <VideoPopup vdocls="btn btn-white-md popup-youtube" style2 />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-sm-6">
                                        <div className="banner-property-detail-2">
                                            {" "}
                                            <img src={img2} alt="" />
                                        </div>
                                        <div className="banner-property-detail-3">
                                            {" "}
                                            <img src={img3} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-sm-6">
                                        <div className="banner-property-detail-4">
                                            {" "}
                                            <img src={img4} alt="" />
                                        </div>
                                        <div className="banner-property-detail-5">
                                            {" "}
                                            <img src={img5} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="box-section box-buttons-destination box-buttons-property-detail background-card pt-40 pb-40">
                        {room.amenities && room.amenities.length > 0 ? (
                            (() => {
                                const rowA = room.amenities.filter((_, i) => i % 2 === 0);
                                const rowB = room.amenities.filter((_, i) => i % 2 === 1);
                                const renderBadge = (a: string, k: string) => (
                                    <span
                                        key={k}
                                        className="btn btn-border-1"
                                        style={{ pointerEvents: 'none', cursor: 'default', flexShrink: 0 }}
                                    >
                                        <img className="light-mode" src="/assets/imgs/page/room/wifi.svg" alt="" />
                                        <img className="dark-mode" src="/assets/imgs/page/room/wifi-w.svg" alt="" />
                                        {a}
                                    </span>
                                );
                                return (
                                    <>
                                        <style>{`
                                            .marquee-row { display: flex; overflow: hidden; width: 100%; }
                                            .marquee-track { display: flex; gap: 12px; padding-right: 12px; flex-shrink: 0; animation-duration: 40s; animation-timing-function: linear; animation-iteration-count: infinite; }
                                            .marquee-row:hover .marquee-track { animation-play-state: paused; }
                                            .marquee-left  { animation-name: marquee-left; }
                                            .marquee-right { animation-name: marquee-right; }
                                            @keyframes marquee-left  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                                            @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
                                        `}</style>
                                        <div className="marquee-row" style={{ marginBottom: 12 }}>
                                            <div className="marquee-track marquee-left">
                                                {rowA.map((a, i) => renderBadge(a, `a1-${i}`))}
                                                {rowA.map((a, i) => renderBadge(a, `a2-${i}`))}
                                            </div>
                                        </div>
                                        {rowB.length > 0 && (
                                            <div className="marquee-row">
                                                <div className="marquee-track marquee-right">
                                                    {rowB.map((a, i) => renderBadge(a, `b1-${i}`))}
                                                    {rowB.map((a, i) => renderBadge(a, `b2-${i}`))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()
                        ) : (
                            <div className="container-fluid">
                                <p className="text-md neutral-500 text-center mb-0">Aucun équipement renseigné pour cette chambre.</p>
                            </div>
                        )}
                    </section>
                    <section className="box-section box-content-tour-detail box-content-room-detail background-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="tour-header">
                                        <div className="tour-rate">
                                            <div className="rate-element">
                                                <span className="rating">
                                                    {reviewCount > 0 ? avgRating.toFixed(1) : "—"} <span className="text-sm-medium neutral-500">({reviewCount} avis)</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="tour-title-main">
                                            <h4 className="neutral-1000">{room.name}</h4>
                                        </div>
                                        <div className="tour-metas">
                                            <div className="tour-meta-left">
                                                <p className="text-md-medium neutral-500 mr-20 tour-location">
                                                    <svg width={12} height={16} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                                    </svg>
                                                    {[hotel?.address?.street, hotel?.address?.city, hotel?.address?.country].filter(Boolean).join(", ") || room.hotelName}
                                                </p>
                                                {hotel?.address && (
                                                    <Link
                                                        className="text-md-medium neutral-1000 mr-30"
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                            [room.hotelName, hotel.address.street, hotel.address.city].filter(Boolean).join(", "),
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Voir sur la carte
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="tour-meta-right">
                                                {" "}
                                                <Link className="btn btn-share" href="#">
                                                    <svg width={16} height={18} viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13 11.5332C12.012 11.5332 11.1413 12.0193 10.5944 12.7584L5.86633 10.3374C5.94483 10.0698 6 9.79249 6 9.49989C6 9.10302 5.91863 8.72572 5.77807 8.37869L10.7262 5.40109C11.2769 6.04735 12.0863 6.46655 13 6.46655C14.6543 6.46655 16 5.12085 16 3.46655C16 1.81225 14.6543 0.466553 13 0.466553C11.3457 0.466553 10 1.81225 10 3.46655C10 3.84779 10.0785 4.20942 10.2087 4.54515L5.24583 7.53149C4.69563 6.90442 3.8979 6.49989 3 6.49989C1.3457 6.49989 0 7.84559 0 9.49989C0 11.1542 1.3457 12.4999 3 12.4999C4.00433 12.4999 4.8897 11.9996 5.4345 11.2397L10.147 13.6529C10.0602 13.9331 10 14.2249 10 14.5332C10 16.1875 11.3457 17.5332 13 17.5332C14.6543 17.5332 16 16.1875 16 14.5332C16 12.8789 14.6543 11.5332 13 11.5332Z" />
                                                    </svg>
                                                    Share
                                                </Link>
                                                <Link className="btn btn-wishlish" href="#">
                                                    <svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.2222 2.3638C4.34203 0.243977 7.65342 0.0419426 10.0004 1.7577C12.3473 0.0419426 15.6587 0.243977 17.7786 2.3638C20.1217 4.70695 20.1217 8.50594 17.7786 10.8491L12.1217 16.5059C10.9501 17.6775 9.05063 17.6775 7.87906 16.5059L2.2222 10.8491C-0.120943 8.50594 -0.120943 4.70695 2.2222 2.3638Z" />
                                                    </svg>
                                                    Wishlish
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-collapse-expand">
                                        <div className="group-collapse-expand">
                                            <button className={isAccordion == 1 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOverview" aria-expanded="false" aria-controls="collapseOverview" onClick={() => handleAccordion(1)}>
                                                <h6>Overview</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            <div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseOverview">
                                                <div className="card card-body">
                                                    <p style={{ whiteSpace: "pre-line" }}>{room.description || "Aucune description fournie pour cette chambre."}</p>
                                                    <p className="mt-3 text-md-medium neutral-500">Surface : {room.size} m² · Capacité : {room.maxOccupancy} pers. · {totalBeds} lit{totalBeds > 1 ? "s" : ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-collapse-expand">
                                            <button className={isAccordion == 2 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseHighlight" aria-expanded="false" aria-controls="collapseHighlight" onClick={() => handleAccordion(2)}>
                                                <h6>What this place offers</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            <div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseHighlight">
                                                <div className="card card-body">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <p className="text-md-bold">Équipements de la chambre :</p>
                                                            {room.amenities.length > 0 ? (
                                                                <>
                                                                    <ul>
                                                                        {(showAllAmenities ? room.amenities : room.amenities.slice(0, 5)).map((a, i) => (
                                                                            <li key={i}>{a}</li>
                                                                        ))}
                                                                    </ul>
                                                                    {room.amenities.length > 5 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowAllAmenities((v) => !v)}
                                                                            className="btn btn-link p-0 mt-1"
                                                                            style={{ color: 'var(--primary, #3F8FCE)', fontWeight: 600, textDecoration: 'none' }}
                                                                        >
                                                                            {showAllAmenities
                                                                                ? 'Voir moins'
                                                                                : `Voir plus (${room.amenities.length - 5})`}
                                                                        </button>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <ul><li>Aucun équipement renseigné</li></ul>
                                                            )}
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <p className="text-md-bold">Points forts :</p>
                                                            {room.highlights && room.highlights.length > 0 ? (
                                                                <ul>
                                                                    {room.highlights.map((h, i) => (
                                                                        <li key={i}>
                                                                            <strong>{h.title}</strong>
                                                                            {h.description ? ` — ${h.description}` : ""}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="text-md-medium neutral-500">Aucun point fort renseigné</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-collapse-expand">
                                            <button className={isAccordion == 3 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseMap" aria-expanded="false" aria-controls="collapseMap" onClick={() => handleAccordion(3)}>
                                                <h6>Tour Map</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            <div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseMap">
                                                <div className="card card-body">
                                                    <div className="pb-35">
                                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d85639.97343647551!2d1.8298143252444794!3d47.873502871808036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e4e4d49df386e3%3A0x9eb97de479c38029!2zT3Jsw6lhbnMsIFBow6Fw!5e0!3m2!1svi!2s!4v1711200672635!5m2!1svi!2s" width="100%" height={290} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-collapse-expand">
                                            <button className={isAccordion == 4 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuestion" aria-expanded="false" aria-controls="collapseQuestion" onClick={() => handleAccordion(4)}>
                                                <h6>Question Answers</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            <div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseQuestion">
                                                <div className="card card-body">
                                                    <div className="list-questions">
                                                        {faq.length === 0 ? (
                                                            <p className="text-sm-medium neutral-500">Aucune question fréquente pour le moment.</p>
                                                        ) : (
                                                            faq.map((f, i) => (
                                                                <div key={i} className={i === 0 ? "item-question active" : "item-question"}>
                                                                    <div className="head-question">
                                                                        <p className="text-md-bold neutral-1000">{f.question}</p>
                                                                    </div>
                                                                    <div className="content-question">
                                                                        <p className="text-sm-medium neutral-800" style={{ whiteSpace: "pre-line" }}>{f.answer}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-collapse-expand">
                                            <button className={isAccordion == 5 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" data-bs-toggle="collapse" data-bs-target="#collapseReviews" aria-expanded="false" aria-controls="collapseReviews" onClick={() => handleAccordion(5)}>
                                                <h6>Rate Reviews</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            <div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseReviews">
                                                <div className="card card-body">
                                                    <div className="head-reviews">
                                                        <div className="review-left">
                                                            <div className="review-info-inner">
                                                                <h6 className="neutral-1000">{reviewCount > 0 ? avgRating.toFixed(2) : "—"} / 5</h6>
                                                                <p className="text-sm-medium neutral-400">({reviewCount} avis)</p>
                                                                <div className="review-rate">
                                                                    {" "}
                                                                    <img src="/assets/imgs/page/tour-detail/star.svg" alt="Wenago" />
                                                                    <img src="/assets/imgs/page/tour-detail/star.svg" alt="Wenago" />
                                                                    <img src="/assets/imgs/page/tour-detail/star.svg" alt="Wenago" />
                                                                    <img src="/assets/imgs/page/tour-detail/star.svg" alt="Wenago" />
                                                                    <img src="/assets/imgs/page/tour-detail/star.svg" alt="Wenago" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="list-reviews">
                                                        {reviews.length === 0 ? (
                                                            <p className="text-sm-medium neutral-500">Pas encore d avis pour cette chambre.</p>
                                                        ) : (
                                                            reviews.map((r) => (
                                                                <div key={r.id} className="item-review">
                                                                    <div className="head-review">
                                                                        <div className="author-review">
                                                                            <div className="author-info">
                                                                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                                                    <p className="text-lg-bold mb-0">{r.guestName}</p>
                                                                                    <span
                                                                                        style={{
                                                                                            display: "inline-flex",
                                                                                            alignItems: "center",
                                                                                            gap: 4,
                                                                                            backgroundColor: "#E6F4EA",
                                                                                            color: "#137333",
                                                                                            fontSize: 11,
                                                                                            fontWeight: 600,
                                                                                            padding: "2px 8px",
                                                                                            borderRadius: 999,
                                                                                        }}
                                                                                    >
                                                                                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                                        Réservation confirmée
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm-medium neutral-500">{new Date(r.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="rate-review">
                                                                            {Array.from({ length: Math.round(toFive(r.rating)) }).map((_, si) => (
                                                                                <img key={si} src="/assets/imgs/page/tour-detail/star-big.svg" alt="" />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="content-review">
                                                                        {r.title && <p className="text-md-bold neutral-1000 mb-5">{r.title}</p>}
                                                                        <p className="text-sm-medium neutral-800">{r.comment}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="group-collapse-expand">
                                            <button className={showQuestionForm ? "btn btn-collapse" : "btn btn-collapse collapsed"} type="button" onClick={() => setShowQuestionForm((v) => !v)}>
                                                <h6>Poser une question</h6>
                                                <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            </button>
                                            {showQuestionForm && (
                                            <div>
                                                <div className="card card-body">
                                                    {questionStatus === "sent" ? (
                                                        <div className="text-md-medium neutral-800">
                                                            ✅ Votre question a bien été envoyée. L&apos;hôtel vous répondra par email rapidement.
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuestion(); }}>
                                                            <div className="row">
                                                                <div className="col-md-6 mb-3">
                                                                    <input className="form-control" type="text" placeholder="Votre nom" value={questionName} onChange={(e) => setQuestionName(e.target.value)} required />
                                                                </div>
                                                                <div className="col-md-6 mb-3">
                                                                    <input className="form-control" type="tel" placeholder="WhatsApp / téléphone (+237 6XX XX XX XX)" value={questionPhone} onChange={(e) => setQuestionPhone(e.target.value)} required />
                                                                </div>
                                                                <div className="col-md-12 mb-3">
                                                                    <textarea className="form-control" placeholder="Votre question pour l&apos;hôtel…" rows={4} value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
                                                                </div>
                                                                {questionStatus === "error" && (
                                                                    <div className="col-md-12 mb-3">
                                                                        <p className="text-sm-medium" style={{ color: "#b91c1c" }}>{questionError || "Impossible d'envoyer la question."}</p>
                                                                    </div>
                                                                )}
                                                                <div className="col-md-12">
                                                                    <button type="submit" className="btn btn-black-lg-square" disabled={questionStatus === "sending"}>
                                                                        {questionStatus === "sending" ? "Envoi…" : "Envoyer la question"}
                                                                        <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="booking-form">
                                        <div className="head-booking-form d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-xl-bold neutral-1000 mb-0">À partir de</p>
                                                {room.onCanal && <p className="text-xs neutral-500 mb-0">Prix canal Honelia</p>}
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p className="text-xl-bold neutral-1000 mb-0" style={{ whiteSpace: "nowrap" }}>
                                                    {formatPrice(room.basePrice)} <span className="text-sm-medium neutral-500">/ nuit</span>
                                                </p>
                                                {room.onCanal && room.basePricePublic && room.basePricePublic > room.basePrice && (
                                                    <p className="text-xs neutral-500 mb-0" style={{ textDecoration: "line-through" }}>
                                                        {formatPrice(room.basePricePublic)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="content-booking-form">
                                            <div className="item-line-booking" style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                                <strong className="text-md-bold neutral-1000 mb-0">Arrivée :</strong>
                                                <input className="form-control calendar-date" type="date" value={bookingCheckIn || defaultCheckIn} min={defaultCheckIn} onChange={(e) => setBookingCheckIn(e.target.value)} />
                                            </div>
                                            <div className="item-line-booking" style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                                <strong className="text-md-bold neutral-1000 mb-0">Départ :</strong>
                                                <input className="form-control calendar-date" type="date" value={bookingCheckOut || defaultCheckOut} min={defaultCheckOut} onChange={(e) => setBookingCheckOut(e.target.value)} />
                                            </div>
                                            <div className="item-line-booking" style={{ display: "grid", gridTemplateColumns: "100px 1fr", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                                <strong className="text-md-bold neutral-1000 mb-0">Voyageurs :</strong>
                                                <select className="form-control" value={bookingTravelers} onChange={(e) => setBookingTravelers(e.target.value)}>
                                                    <option value="1">1 voyageur</option>
                                                    <option value="2">2 voyageurs</option>
                                                    <option value="3">3 voyageurs</option>
                                                    <option value="4">4 voyageurs</option>
                                                </select>
                                            </div>
                                            <div className="box-button-book">
                                                <Link
                                                    className="btn btn-book"
                                                    href={`/reserver/${hotelSlug || room.hotelSlug}/${roomSlug || slugify(room.name)}?checkIn=${bookingCheckIn || defaultCheckIn}&checkOut=${bookingCheckOut || defaultCheckOut}&travelers=${bookingTravelers}`}
                                                >
                                                    Réserver gratuitement
                                                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    </svg>
                                                </Link>
                                            </div>
                                            <div className="box-need-help text-center mt-3">
                                                <Link href="/contact" className="text-sm-medium neutral-500">
                                                    <svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: 6 }}>
                                                        <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" fill="#9CA3AF" />
                                                        <path d="M10 5a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" fill="#9CA3AF" />
                                                        <path d="M10 11a5 5 0 0 0-5 5 1 1 0 0 0 2 0 3 3 0 0 1 6 0 1 1 0 0 0 2 0 5 5 0 0 0-5-5Z" fill="#9CA3AF" />
                                                    </svg>
                                                    Besoin d'aide ?
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {hotel && (
                                        <div className="sidebar-left border-1 background-3">
                                            <h6 className="text-xl-bold neutral-1000">Réception de l'hôtel</h6>
                                            <div className="box-sidebar-content">
                                                <div className="box-agent-support">
                                                    <div className="card-author">
                                                        <div className="card-author-image">
                                                            <img src={hotel.coverUrl || "/assets/imgs/page/property/author.png"} alt={hotel.name} style={{ borderRadius: '50%', width: 64, height: 64, objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="card-author-info">
                                                            <p className="text-lg-bold neutral-1000">{hotel.name}</p>
                                                            <p className="text-sm-medium neutral-500">
                                                                {hotel.address?.city}{hotel.address?.country ? `, ${hotel.address.country}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="box-info-contact">
                                                    {whatsapp && (
                                                        <p className="text-md-medium whatsapp neutral-1000">WhatsApp : {whatsapp}</p>
                                                    )}
                                                    <p className="text-md-medium email neutral-1000">Email : {email}</p>
                                                    {hotel.address?.street && (
                                                        <p className="text-md-medium mobile-phone neutral-1000">Adresse : {hotel.address.street}</p>
                                                    )}
                                                </div>
                                                <div className="box-link-bottom">
                                                    <Link className="link-black" href={`/hotels/${slugify(hotel?.address?.city || "")}/${room.hotelSlug}`}>
                                                        Voir la fiche de l'hôtel
                                                        <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {otherRooms.length > 0 && (
                                        <div className="sidebar-left border-1 background-body">
                                            <h6 className="text-lg-bold neutral-1000">Autres chambres de cet hôtel</h6>
                                            <div className="box-popular-posts box-popular-posts-md">
                                                <ul>
                                                    {otherRooms.slice(0, 5).map((r) => (
                                                        <li key={r._id}>
                                                            <div className="card-post">
                                                                <div className="card-image">
                                                                    <Link href={`/hotels/${slugify(hotel?.address?.city || "")}/${room.hotelSlug}/${slugify(r.name)}`}>
                                                                        <img src={r.photoUrl || "/assets/imgs/page/property/feature.png"} alt={r.name} />
                                                                    </Link>
                                                                </div>
                                                                <div className="card-info">
                                                                    <Link className="text-md-bold" href={`/hotels/${slugify(hotel?.address?.city || "")}/${room.hotelSlug}/${slugify(r.name)}`}>{r.name}</Link>
                                                                    <span className="price text-sm-bold neutral-1000">{formatPrice(r.basePrice)}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {similarRooms.length > 0 && citySlug && hotelSlug && (
                        <section className="box-section box-similar-rooms background-body py-5">
                            <div className="container">
                                <div className="mb-30">
                                    <h2 className="neutral-1000 wow fadeInUp">Vous pourriez aussi aimer</h2>
                                    <p className="text-xl-medium neutral-500 wow fadeInUp">Des chambres avec un tarif similaire</p>
                                </div>
                                <div className="row g-4">
                                    {similarRooms.map((sr) => {
                                        const href = `/hotels/${citySlug}/${hotelSlug}/${slugify(sr.name)}`
                                        const img = sr.photoUrl || FALLBACK
                                        return (
                                            <div className="col-lg-3 col-md-6" key={sr._id}>
                                                <Link href={href} className="card-journey-small background-card" style={{ display: "block", textDecoration: "none" }}>
                                                    <div className="card-image" style={{ overflow: "hidden" }}>
                                                        <img src={img} alt={sr.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                                                    </div>
                                                    <div className="card-info p-3">
                                                        <p className="text-md-bold neutral-1000 mb-5" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sr.name}</p>
                                                        <p className="text-sm-medium neutral-500 mb-10">{sr.size ? `${sr.size} m² · ` : ""}{sr.maxOccupancy} pers.</p>
                                                        <div className="d-flex align-items-end justify-content-between">
                                                            <span className="text-sm-medium neutral-500">À partir de</span>
                                                            <span className="text-lg-bold neutral-1000">{formatPrice(sr.basePrice)}<span className="text-sm-medium neutral-500" style={{ fontWeight: 400 }}> / nuit</span></span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {nearbyRooms.length > 0 && citySlug && (
                        <section className="box-section box-nearby-rooms background-body py-5">
                            <div className="container">
                                <div className="mb-30">
                                    <h2 className="neutral-1000 wow fadeInUp">Chambres à tarif similaire à proximité</h2>
                                    <p className="text-xl-medium neutral-500 wow fadeInUp">Dans d&apos;autres hôtels de la même ville</p>
                                </div>
                                <div className="row g-4">
                                    {nearbyRooms.map((nr) => {
                                        const href = `/hotels/${citySlug}/${nr.hotelSlug}/${slugify(nr.name)}`
                                        const img = nr.photoUrl || FALLBACK
                                        return (
                                            <div className="col-lg-3 col-md-6" key={`${nr.hotelSlug}-${nr._id}`}>
                                                <Link href={href} className="card-journey-small background-card" style={{ display: "block", textDecoration: "none" }}>
                                                    <div className="card-image" style={{ overflow: "hidden" }}>
                                                        <img src={img} alt={nr.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                                                    </div>
                                                    <div className="card-info p-3">
                                                        <p className="text-sm-medium neutral-500 mb-5" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nr.hotelName}</p>
                                                        <p className="text-md-bold neutral-1000 mb-5" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nr.name}</p>
                                                        <p className="text-sm-medium neutral-500 mb-10">{nr.size ? `${nr.size} m² · ` : ""}{nr.maxOccupancy} pers.</p>
                                                        <div className="d-flex align-items-end justify-content-between">
                                                            <span className="text-sm-medium neutral-500">À partir de</span>
                                                            <span className="text-lg-bold neutral-1000">{formatPrice(nr.basePrice)}<span className="text-sm-medium neutral-500" style={{ fontWeight: 400 }}> / nuit</span></span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {nearbyHotels.length > 0 && citySlug && (
                        <section className="box-section box-nearby-hotels background-body py-5">
                            <div className="container">
                                <div className="row align-items-end mb-30">
                                    <div className="col-md-9">
                                        <h2 className="neutral-1000 wow fadeInUp">Hôtels à proximité</h2>
                                        <p className="text-xl-medium neutral-500 wow fadeInUp">D&apos;autres établissements dans la même ville</p>
                                    </div>
                                    <div className="col-md-3 text-md-end">
                                        <Link href={`/hotels/${citySlug}`} className="btn btn-brand-secondary">Voir tous</Link>
                                    </div>
                                </div>
                                <div className="row g-4">
                                    {nearbyHotels.map((h) => (
                                        <div className="col-xl-3 col-lg-4 col-md-6" key={h.hotelId}>
                                            <CanalHotelCard hotel={h} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </Layout>
        </>
    );
}
