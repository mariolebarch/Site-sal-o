import { useMemo, useState } from "react";
import { Trash2, XCircle, Phone } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { formatDateBR, toDateInputValue } from "../../utils/slots";

export function AdminAgenda() {
  const appointments = useAppStore((s) => s.appointments);
  const services = useAppStore((s) => s.services);
  const cancelAppointment = useAppStore((s) => s.cancelAppointment);
  const deleteAppointment = useAppStore((s) => s.deleteAppointment);

  const [filterDate, setFilterDate] = useState(toDateInputValue(new Date()));
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(() => {
    const filtered = showAll ? appointments : appointments.filter((a) => a.date === filterDate);
    return [...filtered].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [appointments, filterDate, showAll]);

  function serviceName(id: string) {
    return services.find((s) => s.id === id)?.name ?? "Procedimento removido";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Agenda</h1>
        <p className="text-sm text-ink-500 mt-1">Gerencie os agendamentos das clientes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-blush-200 p-4 shadow-soft">
        <label className="text-sm text-ink-700 font-medium">Data:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          disabled={showAll}
          className="rounded-lg border border-blush-300 px-3 py-1.5 text-sm disabled:opacity-40"
        />
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Ver todos os agendamentos
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-blush-200 shadow-soft overflow-hidden">
        {list.length === 0 ? (
          <p className="text-sm text-ink-500 p-8 text-center">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blush-50 text-ink-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Cliente</th>
                  <th className="text-left font-semibold px-5 py-3">Procedimento</th>
                  <th className="text-left font-semibold px-5 py-3">Data</th>
                  <th className="text-left font-semibold px-5 py-3">Horário</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-right font-semibold px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-t border-blush-100">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-900">{a.clientName}</p>
                      <a
                        href={`https://wa.me/${a.clientPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-rose-600"
                      >
                        <Phone className="h-3 w-3" /> {a.clientPhone}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{serviceName(a.serviceId)}</td>
                    <td className="px-5 py-3 text-ink-700 whitespace-nowrap">{formatDateBR(a.date)}</td>
                    <td className="px-5 py-3 text-ink-700">{a.startTime} – {a.endTime}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          a.status === "confirmado" ? "bg-green-100 text-green-700" : "bg-ink-500/10 text-ink-500"
                        }`}
                      >
                        {a.status === "confirmado" ? "Confirmado" : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {a.status === "confirmado" && (
                          <button
                            onClick={() => cancelAppointment(a.id)}
                            title="Cancelar"
                            className="p-1.5 rounded-lg text-ink-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Excluir este agendamento definitivamente?")) deleteAppointment(a.id);
                          }}
                          title="Excluir"
                          className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
