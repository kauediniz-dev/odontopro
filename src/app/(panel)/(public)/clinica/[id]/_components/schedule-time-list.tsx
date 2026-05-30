"use client";

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/app/lib/utils";
import { isToday, isSlotThePast } from "./schedule-utils";

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlot: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
  selectedDate,
  selectedTime,
  requiredSlots,
  availableTimeSlot,
  onSelectTime,
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate);

  // Função para verificar se existem slots consecutivos suficientes para a duração do serviço
  const hasEnoughConsecutiveSlots = (startIndex: number) => {
    // Se o serviço precisa de X slots, verificamos se os próximos X-1 também estão livres
    for (let i = 0; i < requiredSlots; i++) {
      const currentSlot = availableTimeSlot[startIndex + i];
      // Se o slot não existe ou já está ocupado (blocked), não cabe o serviço
      if (!currentSlot || !currentSlot.available) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
      {availableTimeSlot.map((slot, index) => {
        const slotIsPast = dateIsToday && isSlotThePast(slot.time);

        // O horário SÓ pode ser selecionado se:
        // 1. Não for passado
        // 2. Estiver disponível (não estiver no blockedTimes)
        // 3. Tiver espaço suficiente para a duração do serviço (consecutive slots)
        const canSelect =
          !slotIsPast && slot.available && hasEnoughConsecutiveSlots(index);

        return (
          <Button
            onClick={() => onSelectTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn(
              "h-10 select-none transition-all",
              selectedTime === slot.time &&
                "border-2 border-emerald-500 bg-emerald-200 text-primary font-bold",
              !canSelect && "opacity-30 bg-gray-200 cursor-not-allowed",
            )}
            disabled={!canSelect}
          >
            {slot.time}
          </Button>
        );
      })}
    </div>
  );
}
