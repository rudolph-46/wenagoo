'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { swiperGroupPayment } from "@/util/swiperOption"
import Link from 'next/link'

export default function SwiperGroupPaymentSlider() {
	return (
		<>
			<Swiper {...swiperGroupPayment}>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/paypal.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/stripe.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/mastercard.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/skrill.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/paypal.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/stripe.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/mastercard.png" alt="Wenago" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/template/icons/skrill.png" alt="Wenago" /></div>
				</SwiperSlide>
			</Swiper>
		</>
	)
}
