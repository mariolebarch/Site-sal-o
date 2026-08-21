import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Ban, Users, Wallet } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { toDateInputValue, formatDateBR } from "../../utils/slots";

export function AdminDashboard() {
  const appointments = useAppStore((s) => s.appointments);
  const services = useAppStore((s) => s.services);
  const blockedDates = useAppStore((s) => s.blockedDates);

  const todayStr = toDateInputValue(new Date());

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === todayStr && a.status === "confirmado")
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [appointments, todayStr]
  );

  const upcoming = useMemo(
    () =>
      appointments
        .filter((a) => a.date >= todayStr && a.status === "confirmado")
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
        .slice(0, 8),
    [appointments, todayStr]
  );

  const weekRevenue = useMemo(() => {
    const now = new Date();
    const in7 = new Date(now);
    in7.setDate(now.getDate() + 7);
    const in7Str = toDateInputValue(in7);
    return appointments
      .filter((a) => a.status === "confirmado" && a.date >= todayStr && a.date <= in7Str)
      .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.price ?? 0), 0);
  }, [appointments, services, todayStr]);

  function serviceName(id: string) {
    return services.find((s) => s.id === id)?.name ?? "Procedimento removido";
  }

  const stats = [
    { label: "Agendamentos hoje", value: todayAppointments.length, icon: CalendarDays },
    { label: "Próximos 7 dias", value: `R$ ${weekRevenue.toFixed(2).replace(".", ",")}`, icon: Wallet },
    { label: "Clientes distintas (total)", value: new Set(appointments.map((a) => a.clientPhone)).size, icon: Users },
    { label: "Bloqueios ativos", value: blockedDates.length, icon: Ban },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Olá, Rosely 👋</h1>
        <p className="text-sm text-ink-500 mt-1">Aqui está o resumo da sua agenda.</p>
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
                    <p className="text-xs text-ink-500">{serviceName(a.serviceId)}</p>
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
                    <p className="text-xs text-ink-500">{serviceName(a.serviceId)} · {formatDateBR(a.date)}</p>
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
