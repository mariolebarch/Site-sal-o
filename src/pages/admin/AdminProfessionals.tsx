import { useState, type FormEvent } from "react";
import { UserPlus, ShieldCheck, User, Info } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const emptyForm = { name: "", email: "", role: "staff" as "admin" | "staff" };

export function AdminProfessionals() {
  const professionals = useAppStore((s) => s.professionals);
  const addProfessional = useAppStore((s) => s.addProfessional);
  const updateProfessional = useAppStore((s) => s.updateProfessional);

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.name.trim().length < 2) {
      setError("Informe o nome da profissional.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }
    setSubmitting(true);
    const result = await addProfessional({ name: form.name.trim(), email: form.email.trim(), role: form.role });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível adicionar a profissional.");
      return;
    }
    setSuccess(`${form.name} foi adicionada! Não esqueça de criar o login dela no Supabase (veja as instruções abaixo).`);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Profissionais</h1>
        <p className="text-sm text-ink-500 mt-1">
          Gerencie quem atende no studio e quem tem acesso de administradora.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-blush-200 shadow-soft divide-y divide-blush-100">
        {professionals.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-blush-100 flex items-center justify-center text-rose-600 shrink-0">
                {p.role === "admin" ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{p.name}</p>
                <p className="text-xs text-ink-500 truncate">{p.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  p.role === "admin" ? "bg-gold-300/30 text-gold-600" : "bg-blush-100 text-rose-700"
                }`}
              >
                {p.role === "admin" ? "Administradora" : "Profissional"}
              </span>
              <label className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={(e) => updateProfessional(p.id, { active: e.target.checked })}
                />
                Ativa
              </label>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blush-200 p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-9 w-9 rounded-full bg-blush-100 flex items-center justify-center text-rose-600">
            <UserPlus className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg text-rose-800">Adicionar profissional</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">E-mail de login</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="nome@email.com"
              className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Papel</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "staff" }))}
              className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
            >
              <option value="staff">Profissional</option>
              <option value="admin">Administradora</option>
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
        >
          <UserPlus className="h-4 w-4" /> {submitting ? "Adicionando..." : "Adicionar profissional"}
        </button>
      </form>

      <div className="bg-blush-50 border border-blush-200 rounded-2xl p-5 flex gap-3">
        <Info className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-sm text-ink-700 leading-relaxed">
          <p className="font-semibold text-rose-800 mb-1">Depois de adicionar aqui, crie o login dela também</p>
          <p>
            Cadastrar a profissional aqui não cria a senha de acesso dela. No{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-rose-600 underline font-medium"
            >
              Supabase Studio
            </a>{" "}
            do projeto, vá em <strong>Authentication → Users → Add user</strong>, use o mesmo e-mail
            cadastrado acima, defina uma senha e marque "Auto Confirm User". Pronto — ela já pode
            entrar em <strong>/login</strong> com esse e-mail e senha.
          </p>
        </div>
      </div>
    </div>
  );
}
