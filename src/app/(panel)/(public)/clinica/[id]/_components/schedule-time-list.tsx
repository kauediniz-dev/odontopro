"use client";

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlot: TimeSlot[];
  clinicTimes: string[];
}

export function ScheduleTimeList({
  selectedDate,
  selectedTime,
  requiredSlots,
  blockedTimes,
  availableTimeSlot,
  clinicTimes,
}: ScheduleTimeListProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {availableTimeSlot.map((slot) => {
        return (
          <Button
            type="button"
            variant="outline"
            key={slot.time}
            className="h-10 select-none"
          >
            {slot.time}
          </Button>
        );
      })}
    </div>
  );
}
