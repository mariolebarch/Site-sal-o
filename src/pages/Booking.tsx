import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle, CalendarCheck } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StepIndicator } from "../components/booking/StepIndicator";
import { CalendarPicker } from "../components/booking/CalendarPicker";
import { TimeSlotGrid } from "../components/booking/TimeSlotGrid";
import { useAppStore } from "../store/useAppStore";
import { serviceCategories } from "../data/services";
import { IconHand, IconFoot, IconSparkleGlyph, IconCombo, IconExtra } from "../components/decor/Icons";
import { formatDateBR } from "../utils/slots";
import { buildWhatsAppMessage, whatsappLinkWithMessage } from "../utils/whatsapp";

const categoryIcons = {
  hand: IconHand,
  foot: IconFoot,
  sparkle: IconSparkleGlyph,
  combo: IconCombo,
  extra: IconExtra,
};

const STEPS = ["Categoria", "Procedimento", "Data", "Horário", "Seus dados", "Confirmação"];

export function Booking() {
  const [params] = useSearchParams();
  const services = useAppStore((s) => s.services);
  const addAppointment = useAppStore((s) => s.addAppointment);

  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);

  useEffect(() => {
    const presetId = params.get("service");
    if (presetId) {
      const svc = services.find((s) => s.id === presetId && s.active);
      if (svc) {
        setCategoryId(svc.categoryId);
        setServiceId(svc.id);
        setStep(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetAll() {
    setStep(0);
    setCategoryId(null);
    setServiceId(null);
    setDate(null);
    setTime(null);
    setClientName("");
    setClientPhone("");
    setNotes("");
    setDone(false);
  }

  function canAdvance() {
    if (step === 0) return !!categoryId;
    if (step === 1) return !!serviceId;
    if (step === 2) return !!date;
    if (step === 3) return !!time;
    if (step === 4) return clientName.trim().length > 1 && clientPhone.trim().length >= 8;
    return true;
  }

  async function handleConfirm() {
    if (!selectedService || !date || !time) return;
    const endMinutes = time.split(":").map(Number);
    const totalStart = endMinutes[0] * 60 + endMinutes[1];
    const totalEnd = totalStart + selectedService.durationMin;
    const endTime = `${Math.floor(totalEnd / 60).toString().padStart(2, "0")}:${(totalEnd % 60).toString().padStart(2, "0")}`;

    setSubmitError("");
    setSubmitting(true);
    const result = await addAppointment({
      serviceId: selectedService.id,
      date,
      startTime: time,
      endTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      notes: notes.trim() || undefined,
    });
    setSubmitting(false);
    if (result.ok) {
      setDone(true);
    } else {
      setSubmitError("Não foi possível confirmar o agendamento. Tente novamente em instantes.");
    }
  }

  const whatsappMessage = selectedService && date && time
    ? buildWhatsAppMessage({ serviceName: selectedService.name, date, startTime: time, clientName: clientName || "" })
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-cream-100 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-600">Agendamento</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl text-rose-900">Marque seu horário</h1>
            <p className="mt-2 text-ink-500 text-sm">Rápido, simples e com horários sempre atualizados.</p>
          </div>

          {!done && <StepIndicator steps={STEPS} current={step} />}

          <div className="bg-white rounded-3xl shadow-soft border border-blush-200 p-6 sm:p-10">
            {done ? (
              <div className="text-center py-6 animate-fade-up">
                <div className="mx-auto h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-5">
                  <CalendarCheck className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl text-rose-900">Pré-agendamento realizado!</h2>
                <p className="mt-2 text-ink-500 max-w-md mx-auto text-sm leading-relaxed">
                  Seu horário para <strong>{selectedService?.name}</strong> em{" "}
                  <strong>{date && formatDateBR(date)}</strong> às <strong>{time}</strong> foi reservado.
                  Confirme com a Rosely pelo WhatsApp para garantir seu atendimento.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={whatsappLinkWithMessage(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:brightness-95 text-white font-semibold px-6 py-3 transition"
                  >
                    <MessageCircle className="h-4 w-4" /> Confirmar no WhatsApp
                  </a>
                  <button
                    onClick={resetAll}
                    className="rounded-full border border-blush-300 hover:border-rose-400 text-rose-700 font-semibold px-6 py-3 transition-colors"
                  >
                    Novo agendamento
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-fade-up">
                    {serviceCategories.map((cat) => {
                      const Icon = categoryIcons[cat.icon];
                      const active = categoryId === cat.id;
                      const count = services.filter((s) => s.categoryId === cat.id && s.active).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryId(cat.id)}
                          className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all
                            ${active ? "border-rose-500 bg-blush-50 shadow-soft" : "border-blush-200 hover:border-rose-300"}
                          `}
                        >
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-rose-600 text-white" : "bg-blush-100 text-rose-600"}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-ink-900">{cat.name}</p>
                            <p className="text-xs text-ink-500 mt-0.5">{count} procedimento(s)</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3 animate-fade-up">
                    {services
                      .filter((s) => s.categoryId === categoryId && s.active)
                      .map((s) => {
                        const active = serviceId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setServiceId(s.id)}
                            className={`w-full flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all
                              ${active ? "border-rose-500 bg-blush-50 shadow-soft" : "border-blush-200 hover:border-rose-300"}
                            `}
                          >
                            <div>
                              <p className="font-semibold text-ink-900">{s.name}</p>
                              <p className="text-xs text-ink-500 mt-1">{s.description}</p>
                              <p className="text-xs text-ink-500 mt-1">{s.durationMin} min</p>
                            </div>
                            <span className="font-display text-lg text-rose-600 shrink-0">
                              R$ {s.price.toFixed(2).replace(".", ",")}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-up">
                    <CalendarPicker selectedDate={date} onSelect={(d) => setDate(d)} />
                  </div>
                )}

                {step === 3 && date && selectedService && (
                  <div className="animate-fade-up">
                    <p className="text-sm text-ink-500 mb-4">
                      Horários disponíveis para <strong className="text-ink-900">{formatDateBR(date)}</strong>
                    </p>
                    <TimeSlotGrid
                      date={date}
                      durationMin={selectedService.durationMin}
                      selectedTime={time}
                      onSelect={setTime}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4 animate-fade-up max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">Nome completo</label>
                      <input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full rounded-xl border border-blush-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">WhatsApp</label>
                      <input
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(11) 91234-5678"
                        className="w-full rounded-xl border border-blush-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">Observações (opcional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Alguma preferência de cor, desenho ou observação"
                        className="w-full rounded-xl border border-blush-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                      />
                    </div>
                  </div>
                )}

                {step === 5 && selectedService && date && time && (
                  <div className="animate-fade-up max-w-md mx-auto">
                    <h3 className="font-display text-xl text-rose-900 mb-5">Confira os detalhes</h3>
                    <dl className="space-y-3 text-sm">
                      {[
                        ["Procedimento", selectedService.name],
                        ["Duração", `${selectedService.durationMin} min`],
                        ["Valor", `R$ ${selectedService.price.toFixed(2).replace(".", ",")}`],
                        ["Data", formatDateBR(date)],
                        ["Horário", time],
                        ["Nome", clientName],
                        ["WhatsApp", clientPhone],
                        ...(notes ? [["Observações", notes]] : []),
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 border-b border-blush-100 pb-2">
                          <dt className="text-ink-500">{label}</dt>
                          <dd className="text-ink-900 font-medium text-right">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {submitError && (
                  <p className="mt-4 text-center text-xs text-red-600 max-w-md mx-auto">{submitError}</p>
                )}

                <div className="mt-9 flex items-center justify-between max-w-md mx-auto">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-rose-600 disabled:opacity-0 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </button>

                  {step < 5 ? (
                    <button
                      onClick={() => canAdvance() && setStep((s) => s + 1)}
                      disabled={!canAdvance()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
                    >
                      Continuar <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 text-sm transition-colors"
                    >
                      <Check className="h-4 w-4" /> {submitting ? "Confirmando..." : "Confirmar agendamento"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {!done && (
            <p className="text-center text-xs text-ink-500 mt-6">
              Precisa de ajuda?{" "}
              <Link to="/#localizacao" className="text-rose-600 font-medium">
                Veja nosso contato
              </Link>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
