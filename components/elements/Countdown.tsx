'use client'
import { useEffect, useState } from "react"

const msInSecond = 1000
const msInMinute = 60 * 1000
const msInAHour = 60 * msInMinute
const msInADay = 24 * msInAHour

const getPartsofTimeDuration = (duration: any) => {
	const days = Math.floor(duration / msInADay)
	const hours = Math.floor((duration % msInADay) / msInAHour)
	const minutes = Math.floor((duration % msInAHour) / msInMinute)
	const seconds = Math.floor((duration % msInMinute) / msInSecond)

	return { days, hours, minutes, seconds }
}

const Countdown = (endDateTime: any) => {
	const [now, setNow] = useState<number | null>(null)

	useEffect(() => {
		setNow(Date.now())
		const interval = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(interval)
	}, [])

	const future = new Date(endDateTime.endDateTime)
	const timeDif = now !== null ? future.getTime() - now : 0
	const timeParts = getPartsofTimeDuration(timeDif)

	// const countDownTime = `${timeParts.days} Days ${timeParts.hours} Hours and ${timeParts.minutes} minutes and ${timeParts.seconds} seconds`;
	return (
		<>
			<div className="deals-countdown">
				<span className="countdown-section">
					<span className="countdown-amount font-sm-bold lh-16">{timeParts.days}</span>
					<span className="countdown-period lh-14 font-xs"> days </span>
				</span>
				<span className="countdown-section">
					<span className="countdown-amount font-sm-bold lh-16">{timeParts.hours}</span>
					<span className="countdown-period font-xs lh-14"> hours </span>
				</span>
				<span className="countdown-section">
					<span className="countdown-amount font-sm-bold lh-16">{timeParts.minutes}</span>
					<span className="countdown-period font-xs lh-14"> mins </span>
				</span>
				<span className="countdown-section">
					<span className="countdown-amount font-sm-bold lh-16">{timeParts.seconds}</span>
					<span className="countdown-period font-xs lh-14"> secs </span>
				</span>
			</div>

		</>
	)
}

export default Countdown