import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { supabase } from "../../lib/supabaseClient";
import { generateTimeSlots, getWeekday, toDateInputValue, type BookedRange } from "../../utils/slots";

interface TimeSlotGridProps {
  date: string;
  durationMin: number;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotGrid({ date, durationMin, selectedTime, onSelect }: TimeSlotGridProps) {
  const businessHours = useAppStore((s) => s.businessHours);
  const blockedDates = useAppStore((s) => s.blockedDates);
  const blockedRanges = useAppStore((s) => s.blockedRanges);

  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .rpc("get_booked_slots", { p_date: date })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setBookedRanges([]);
        } else {
          setBookedRanges(
            (data ?? []).map((r: { start_time: string; end_time: string }) => ({
              startTime: r.start_time,
              endTime: r.end_time,
            }))
          );
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [date]);

  const slots = useMemo(() => {
    const now = new Date();
    const isToday = toDateInputValue(now) === date;
    return generateTimeSlots({
      date,
      durationMin,
      dayHours: businessHours[getWeekday(date)],
      blockedDates,
      blockedRanges,
      bookedRanges,
      isToday,
      nowMinutes: now.getHours() * 60 + now.getMinutes(),
    });
  }, [date, durationMin, businessHours, blockedDates, blockedRanges, bookedRanges]);

  const available = slots.filter((s) => s.available);

  if (loading) {
    return (
      <p className="text-sm text-ink-500 bg-blush-100/60 rounded-xl p-4 text-center">
        Carregando horários disponíveis...
      </p>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-ink-500 bg-blush-100/60 rounded-xl p-4 text-center">
        O studio não atende neste dia. Escolha outra data no calendário.
      </p>
    );
  }

  if (available.length === 0) {
    return (
      <p className="text-sm text-ink-500 bg-blush-100/60 rounded-xl p-4 text-center">
        Não há horários livres nesta data para esse procedimento. Tente outra data.
      </p>
    );
  }

  const groups: { label: string; items: typeof slots }[] = [
    { label: "Manhã", items: slots.filter((s) => Number(s.time.split(":")[0]) < 12) },
    { label: "Tarde", items: slots.filter((s) => { const h = Number(s.time.split(":")[0]); return h >= 12 && h < 18; }) },
    { label: "Noite", items: slots.filter((s) => Number(s.time.split(":")[0]) >= 18) },
  ];

  return (
    <div className="space-y-5">
      {groups.map((g) =>
        g.items.length > 0 ? (
          <div key={g.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">{g.label}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {g.items.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelect(slot.time)}
                  title={
                    slot.reason === "ocupado"
                      ? "Horário já reservado"
                      : slot.reason === "bloqueado"
                      ? "Horário bloqueado pela profissional"
                      : undefined
                  }
                  className={`rounded-lg py-2.5 text-sm font-medium border transition-colors
                    ${selectedTime === slot.time ? "bg-rose-600 border-rose-600 text-white shadow-soft" : ""}
                    ${slot.available && selectedTime !== slot.time ? "border-blush-300 text-ink-900 hover:border-rose-400 hover:bg-blush-50" : ""}
                    ${!slot.available ? "border-transparent bg-ink-500/5 text-ink-500/40 cursor-not-allowed line-through" : ""}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
