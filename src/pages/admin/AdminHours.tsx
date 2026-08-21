import { useAppStore } from "../../store/useAppStore";
import { weekdayNames, type Weekday } from "../../data/business";

const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function AdminHours() {
  const businessHours = useAppStore((s) => s.businessHours);
  const updateBusinessHours = useAppStore((s) => s.updateBusinessHours);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Horário de funcionamento</h1>
        <p className="text-sm text-ink-500 mt-1">
          Defina os dias e horários em que você atende. Os horários de agendamento são gerados automaticamente com base nisso.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blush-200 shadow-soft divide-y divide-blush-100">
        {order.map((day) => {
          const h = businessHours[day];
          return (
            <div key={day} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <label className="inline-flex items-center gap-2 w-40 shrink-0">
                <input
                  type="checkbox"
                  checked={h.open}
                  onChange={(e) => updateBusinessHours(day, { ...h, open: e.target.checked })}
                />
                <span className="text-sm font-medium text-ink-900">{weekdayNames[day]}</span>
              </label>

              {h.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.start}
                    onChange={(e) => updateBusinessHours(day, { ...h, start: e.target.value })}
                    className="rounded-lg border border-blush-300 px-3 py-1.5 text-sm"
                  />
                  <span className="text-ink-500 text-sm">até</span>
                  <input
                    type="time"
                    value={h.end}
                    onChange={(e) => updateBusinessHours(day, { ...h, end: e.target.value })}
                    className="rounded-lg border border-blush-300 px-3 py-1.5 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-ink-500">Fechado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
