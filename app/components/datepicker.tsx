"use client";

import { type DayClickEventHandler } from "react-day-picker";

import { Calendar } from "./ui/calendar";

export default function DatePicker({
  date,
  handleDaySelect,
}: {
  date: Date | undefined;
  handleDaySelect: DayClickEventHandler;
}) {
  return (
    <Calendar
      mode="single"
      selected={date}
      className="tw-rounded-md  tw-border"
      onDayClick={handleDaySelect}
      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
    />
  );
}
