import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { weekdayNames, defaultBusinessHours, type Weekday } from "../../data/business";

const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export function AdminHours() {
  const businessHoursByProfessional = useAppStore((s) => s.businessHoursByProfessional);
  const professionals = useAppStore((s) => s.professionals);
  const currentProfessional = useAppStore((s) => s.currentProfessional);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const updateBusinessHours = useAppStore((s) => s.updateBusinessHours);

  const [scopeProfessionalId, setScopeProfessionalId] = useState(currentProfessional?.id ?? "");
  const businessHours = businessHoursByProfessional[scopeProfessionalId] ?? defaultBusinessHours;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Horário de funcionamento</h1>
          <p className="text-sm text-ink-500 mt-1">
            Defina os dias e horários em que você atende. Os horários de agendamento são gerados automaticamente com base nisso.
          </p>
        </div>
        {isAdmin && (
          <select
            value={scopeProfessionalId}
            onChange={(e) => setScopeProfessionalId(e.target.value)}
            className="rounded-lg border border-blush-300 px-3 py-2 text-sm"
          >
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
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
                  onChange={(e) => updateBusinessHours(scopeProfessionalId, day, { ...h, open: e.target.checked })}
                />
                <span className="text-sm font-medium text-ink-900">{weekdayNames[day]}</span>
              </label>

              {h.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.start}
                    onChange={(e) => updateBusinessHours(scopeProfessionalId, day, { ...h, start: e.target.value })}
                    className="rounded-lg border border-blush-300 px-3 py-1.5 text-sm"
                  />
                  <span className="text-ink-500 text-sm">até</span>
                  <input
                    type="time"
                    value={h.end}
                    onChange={(e) => updateBusinessHours(scopeProfessionalId, day, { ...h, end: e.target.value })}
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
