import type { Weekday, DayHours } from "../data/business";
import type { Appointment, BlockedDate, BlockedRange } from "../store/useAppStore";

export const SLOT_STEP_MIN = 15;

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function getWeekday(dateStr: string): Weekday {
  // dateStr = "yyyy-MM-dd", parsed as local date (avoid TZ shift from new Date(str))
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getDay() as Weekday;
}

export function isPastDate(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  reason?: "passado" | "ocupado" | "bloqueado" | "fora-do-horario";
}

interface GenerateSlotsParams {
  date: string;
  durationMin: number;
  dayHours: DayHours;
  blockedDates: BlockedDate[];
  blockedRanges: BlockedRange[];
  appointments: Appointment[];
  nowMinutes?: number;
  isToday?: boolean;
}

export function generateTimeSlots({
  date,
  durationMin,
  dayHours,
  blockedDates,
  blockedRanges,
  appointments,
  nowMinutes,
  isToday,
}: GenerateSlotsParams): TimeSlot[] {
  if (!dayHours.open) return [];
  if (isPastDate(date)) return [];

  const dayFullyBlocked = blockedDates.some((b) => b.date === date);

  const dayStart = timeToMinutes(dayHours.start);
  const dayEnd = timeToMinutes(dayHours.end);

  const rangesForDay = blockedRanges.filter((r) => r.date === date);
  const bookedForDay = appointments.filter(
    (a) => a.date === date && a.status === "confirmado"
  );

  const slots: TimeSlot[] = [];

  for (let start = dayStart; start + durationMin <= dayEnd; start += SLOT_STEP_MIN) {
    const end = start + durationMin;
    let available = true;
    let reason: TimeSlot["reason"];

    if (isToday && nowMinutes !== undefined && start <= nowMinutes) {
      available = false;
      reason = "passado";
    } else if (dayFullyBlocked) {
      available = false;
      reason = "bloqueado";
    } else if (rangesForDay.some((r) => overlaps(start, end, timeToMinutes(r.startTime), timeToMinutes(r.endTime)))) {
      available = false;
      reason = "bloqueado";
    } else if (
      bookedForDay.some((a) => overlaps(start, end, timeToMinutes(a.startTime), timeToMinutes(a.endTime)))
    ) {
      available = false;
      reason = "ocupado";
    }

    slots.push({ time: minutesToTime(start), endTime: minutesToTime(end), available, reason });
  }

  return slots;
}

export function formatDateBR(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
