
'use client'
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function MyDatePicker() {
	const [startDate, setStartDate] = useState<Date | null>(null)
	useEffect(() => {
		setStartDate(new Date())
	}, [])
  return (
	<>
		<DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)} className="search-input datepicker" />
	</>
  )
}
