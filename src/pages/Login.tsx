import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Monogram } from "../components/decor/Icons";
import { useAppStore } from "../store/useAppStore";

export function Login() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) {
      navigate("/admin");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush-100 via-cream-100 to-blush-200 px-6 py-16 relative">
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-rose-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao site
      </Link>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-soft border border-blush-200 p-8">
        <div className="flex flex-col items-center text-center">
          <Monogram className="h-12 w-12 text-rose-600" />
          <h1 className="mt-4 font-display text-2xl text-rose-900">Área da profissional</h1>
          <p className="mt-1 text-sm text-ink-500">Entre para gerenciar sua agenda e horários.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Senha de acesso</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-blush-300 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500/60 hover:text-rose-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 text-sm transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-500/70 leading-relaxed">
          Senha padrão inicial: <code className="font-mono bg-blush-100 px-1.5 py-0.5 rounded">rosely2026</code>
          <br />
          Altere em Configurações após o primeiro acesso.
        </p>
      </div>
    </div>
  );
}
