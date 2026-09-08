import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function AdminSettings() {
  const changePassword = useAppStore((s) => s.changePassword);
  const [next, setNext] = useState("");
  const [confirmNext, setConfirmNext] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (next.length < 6) {
      setMessage({ type: "error", text: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }
    if (next !== confirmNext) {
      setMessage({ type: "error", text: "A confirmação não coincide com a nova senha." });
      return;
    }
    setLoading(true);
    const result = await changePassword(next);
    setLoading(false);
    if (result.ok) {
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setNext("");
      setConfirmNext("");
    } else {
      setMessage({ type: "error", text: result.error ?? "Não foi possível alterar a senha." });
    }
  }

  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-rose-900">Configurações</h1>
        <p className="text-sm text-ink-500 mt-1">Altere a senha de acesso ao painel administrativo.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blush-200 p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-9 w-9 rounded-full bg-blush-100 flex items-center justify-center text-rose-600">
            <KeyRound className="h-4 w-4" />
          </div>
          <h2 className="font-display text-lg text-rose-800">Trocar senha</h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-500 mb-1">Nova senha</label>
          <input
            type="password"
            required
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-500 mb-1">Confirmar nova senha</label>
          <input
            type="password"
            required
            value={confirmNext}
            onChange={(e) => setConfirmNext(e.target.value)}
            className="w-full rounded-lg border border-blush-300 px-3 py-2 text-sm"
          />
        </div>

        {message && (
          <p className={`text-xs ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>{message.text}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
