"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ButtonPickerAppointment() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedDate(event.target.value);

    const url = new URL(window.location.href);
    url.searchParams.set("date", event.target.value); // Adiciona o parâmetro "date" na URL
    router.push(url.toString()); // Navega para a nova URL
  }

  return (
    <input
      type="date"
      id="start"
      className="border-2 px-2 py-1 rounded-md text-sm md:text-base"
      value={selectedDate}
      onChange={handleDateChange}
    />
  );
}
