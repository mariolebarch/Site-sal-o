import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Ban, Users, Wallet } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { toDateInputValue, formatDateBR } from "../../utils/slots";

export function AdminDashboard() {
  const appointments = useAppStore((s) => s.appointments);
  const services = useAppStore((s) => s.services);
  const blockedDates = useAppStore((s) => s.blockedDates);
  const professionals = useAppStore((s) => s.professionals);
  const currentProfessional = useAppStore((s) => s.currentProfessional);
  const isAdmin = useAppStore((s) => s.isAdmin);

  const [filterProfessionalId, setFilterProfessionalId] = useState<string>("all");
  const activeFilter = isAdmin ? filterProfessionalId : currentProfessional?.id ?? "all";

  const scopedAppointments = useMemo(
    () => (activeFilter === "all" ? appointments : appointments.filter((a) => a.professionalId === activeFilter)),
    [appointments, activeFilter]
  );
  const scopedBlockedDates = useMemo(
    () => (activeFilter === "all" ? blockedDates : blockedDates.filter((b) => b.professionalId === activeFilter)),
    [blockedDates, activeFilter]
  );

  const todayStr = toDateInputValue(new Date());

  const todayAppointments = useMemo(
    () =>
      scopedAppointments
        .filter((a) => a.date === todayStr && a.status === "confirmado")
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [scopedAppointments, todayStr]
  );

  const upcoming = useMemo(
    () =>
      scopedAppointments
        .filter((a) => a.date >= todayStr && a.status === "confirmado")
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
        .slice(0, 8),
    [scopedAppointments, todayStr]
  );

  const weekRevenue = useMemo(() => {
    const now = new Date();
    const in7 = new Date(now);
    in7.setDate(now.getDate() + 7);
    const in7Str = toDateInputValue(in7);
    return scopedAppointments
      .filter((a) => a.status === "confirmado" && a.date >= todayStr && a.date <= in7Str)
      .reduce(
        (sum, a) =>
          sum + a.serviceIds.reduce((s2, id) => s2 + (services.find((s) => s.id === id)?.price ?? 0), 0),
        0
      );
  }, [scopedAppointments, services, todayStr]);

  function serviceName(ids: string[]) {
    const names = ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean) as string[];
    return names.length > 0 ? names.join(" + ") : "Procedimento removido";
  }

  function professionalName(id: string) {
    return professionals.find((p) => p.id === id)?.name ?? "";
  }

  const stats = [
    { label: "Agendamentos hoje", value: todayAppointments.length, icon: CalendarDays },
    { label: "Próximos 7 dias", value: `R$ ${weekRevenue.toFixed(2).replace(".", ",")}`, icon: Wallet },
    { label: "Clientes distintas (total)", value: new Set(scopedAppointments.map((a) => a.clientPhone)).size, icon: Users },
    { label: "Bloqueios ativos", value: scopedBlockedDates.length, icon: Ban },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Olá, {currentProfessional?.name} 👋</h1>
          <p className="text-sm text-ink-500 mt-1">Aqui está o resumo da sua agenda.</p>
        </div>
        {isAdmin && (
          <select
            value={filterProfessionalId}
            onChange={(e) => setFilterProfessionalId(e.target.value)}
            className="rounded-lg border border-blush-300 px-3 py-2 text-sm"
          >
            <option value="all">Todas as profissionais</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-blush-200 p-5 shadow-soft">
            <div className="h-9 w-9 rounded-full bg-blush-100 flex items-center justify-center text-rose-600 mb-3">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl text-rose-800">{s.value}</p>
            <p className="text-xs text-ink-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-rose-800">Hoje</h2>
            <Link to="/admin/agenda" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Ver agenda completa
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-ink-500">Nenhum agendamento para hoje.</p>
          ) : (
            <ul className="space-y-3">
              {todayAppointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 border-b border-blush-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{a.clientName}</p>
                    <p className="text-xs text-ink-500">
                      {serviceName(a.serviceIds)}
                      {activeFilter === "all" && ` · ${professionalName(a.professionalId)}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-rose-600 shrink-0">{a.startTime}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-rose-800">Próximos agendamentos</h2>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-500">Nenhum agendamento futuro.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 border-b border-blush-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{a.clientName}</p>
                    <p className="text-xs text-ink-500">
                      {serviceName(a.serviceIds)} · {formatDateBR(a.date)}
                      {activeFilter === "all" && ` · ${professionalName(a.professionalId)}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-rose-600 shrink-0">{a.startTime}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
