import { useMemo, useState } from "react";
import { Trash2, XCircle, Phone, Plus, X, BellRing, Check } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { formatDateBR, toDateInputValue } from "../../utils/slots";
import { serviceCategories } from "../../data/services";
import { TimeSlotGrid } from "../../components/booking/TimeSlotGrid";
import { buildReminderMessage, whatsappLinkToPhone } from "../../utils/whatsapp";

const emptyManualForm = {
  serviceIds: [] as string[],
  date: toDateInputValue(new Date()),
  time: null as string | null,
  clientName: "",
  clientPhone: "",
  notes: "",
};

export function AdminAgenda() {
  const appointments = useAppStore((s) => s.appointments);
  const services = useAppStore((s) => s.services);
  const cancelAppointment = useAppStore((s) => s.cancelAppointment);
  const deleteAppointment = useAppStore((s) => s.deleteAppointment);
  const addAppointment = useAppStore((s) => s.addAppointment);

  const [filterDate, setFilterDate] = useState(toDateInputValue(new Date()));
  const [showAll, setShowAll] = useState(false);

  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState(emptyManualForm);
  const [manualError, setManualError] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const list = useMemo(() => {
    const filtered = showAll ? appointments : appointments.filter((a) => a.date === filterDate);
    return [...filtered].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [appointments, filterDate, showAll]);

  function serviceNames(ids: string[]) {
    const names = ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean) as string[];
    return names.length > 0 ? names.join(" + ") : "Procedimento removido";
  }

  const manualSelectedServices = useMemo(
    () => services.filter((s) => manualForm.serviceIds.includes(s.id)),
    [services, manualForm.serviceIds]
  );
  const manualTotalDuration = manualSelectedServices.reduce((sum, s) => sum + s.durationMin, 0);

  function toggleManualService(id: string) {
    setManualForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id],
      time: null,
    }));
  }

  function openManualForm() {
    setManualForm(emptyManualForm);
    setManualError("");
    setShowManualForm(true);
  }

  async function handleManualSubmit() {
    setManualError("");
    if (manualForm.serviceIds.length === 0) {
      setManualError("Selecione ao menos um procedimento.");
      return;
    }
    if (!manualForm.time) {
      setManualError("Selecione um horário.");
      return;
    }
    if (manualForm.clientName.trim().length < 2 || manualForm.clientPhone.trim().length < 8) {
      setManualError("Informe o nome e o WhatsApp da cliente.");
      return;
    }

    const [h, m] = manualForm.time.split(":").map(Number);
    const totalStart = h * 60 + m;
    const totalEnd = totalStart + manualTotalDuration;
    const endTime = `${Math.floor(totalEnd / 60).toString().padStart(2, "0")}:${(totalEnd % 60).toString().padStart(2, "0")}`;

    setManualSubmitting(true);
    const result = await addAppointment({
      serviceIds: manualForm.serviceIds,
      date: manualForm.date,
      startTime: manualForm.time,
      endTime,
      clientName: manualForm.clientName.trim(),
      clientPhone: manualForm.clientPhone.trim(),
      notes: manualForm.notes.trim() || undefined,
    });
    setManualSubmitting(false);

    if (!result.ok) {
      setManualError(
        `Não foi possível criar o agendamento. Tente novamente.${
          result.error ? ` (detalhe técnico: ${result.error})` : ""
        }`
      );
      return;
    }
    setShowManualForm(false);
    setManualForm(emptyManualForm);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Agenda</h1>
          <p className="text-sm text-ink-500 mt-1">Gerencie os agendamentos das clientes.</p>
        </div>
        {!showManualForm && (
          <button
            onClick={openManualForm}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            <Plus className="h-4 w-4" /> Novo agendamento
          </button>
        )}
      </div>

      {showManualForm && (
        <div className="bg-white rounded-2xl border border-blush-200 p-6 shadow-soft space-y-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-rose-800">Marcar horário manualmente</h2>
            <button
              onClick={() => setShowManualForm(false)}
              className="p-1.5 rounded-lg text-ink-500 hover:text-rose-600 hover:bg-blush-50"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <p className="text-xs font-medium text-ink-500 mb-2">Procedimentos</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceCategories.map((cat) => {
                const items = services.filter((s) => s.categoryId === cat.id && s.active);
                if (items.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <p className="text-xs font-semibold text-rose-700 mb-1.5">{cat.name}</p>
                    <div className="space-y-1.5">
                      {items.map((s) => {
                        const active = manualForm.serviceIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleManualService(s.id)}
                            className={`w-full flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors
                              ${active ? "border-rose-500 bg-blush-50" : "border-blush-200 hover:border-rose-300"}
                            `}
                          >
                            <span
                              className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                                active ? "bg-rose-600 border-rose-600 text-white" : "border-blush-300"
                              }`}
                            >
                              {active && <Check className="h-3 w-3" />}
                            </span>
                            <span className="text-ink-900">{s.name}</span>
                            <span className="ml-auto text-xs text-ink-500 shrink-0">{s.durationMin} min</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {manualSelectedServices.length > 0 && (
              <p className="mt-2 text-xs text-ink-500">Duração total: {manualTotalDuration} min</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Data</label>
              <input
                type="date"
                min={toDateInputValue(new Date())}
                value={manualForm.date}
                onChange={(e) => setManualForm((f) => ({ ...f, date: e.target.value, time: null }))}
                className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Nome da cliente</label>
              <input
                value={manualForm.clientName}
                onChange={(e) => setManualForm((f) => ({ ...f, clientName: e.target.value }))}
                placeholder="Nome completo"
                className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">WhatsApp da cliente</label>
              <input
                value={manualForm.clientPhone}
                onChange={(e) => setManualForm((f) => ({ ...f, clientPhone: e.target.value }))}
                placeholder="(11) 91234-5678"
                className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Observações (opcional)</label>
              <input
                value={manualForm.notes}
                onChange={(e) => setManualForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {manualSelectedServices.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-500 mb-2">
                Horário disponível em {formatDateBR(manualForm.date)}
              </p>
              <TimeSlotGrid
                date={manualForm.date}
                durationMin={manualTotalDuration}
                selectedTime={manualForm.time}
                onSelect={(t) => setManualForm((f) => ({ ...f, time: t }))}
              />
            </div>
          )}

          {manualError && <p className="text-xs text-red-600">{manualError}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSubmit}
              disabled={manualSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              {manualSubmitting ? "Salvando..." : "Confirmar agendamento"}
            </button>
            <button
              onClick={() => setShowManualForm(false)}
              className="text-sm font-medium text-ink-500 hover:text-rose-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

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
                        href={whatsappLinkToPhone(a.clientPhone)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-rose-600"
                      >
                        <Phone className="h-3 w-3" /> {a.clientPhone}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{serviceNames(a.serviceIds)}</td>
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
                          <a
                            href={whatsappLinkToPhone(
                              a.clientPhone,
                              buildReminderMessage({
                                serviceNames: a.serviceIds
                                  .map((id) => services.find((s) => s.id === id)?.name)
                                  .filter(Boolean) as string[],
                                date: a.date,
                                startTime: a.startTime,
                                clientName: a.clientName,
                              })
                            )}
                            target="_blank"
                            rel="noreferrer"
                            title="Enviar lembrete pelo WhatsApp"
                            className="p-1.5 rounded-lg text-ink-500 hover:text-[#25D366] hover:bg-green-50"
                          >
                            <BellRing className="h-4 w-4" />
                          </a>
                        )}
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
