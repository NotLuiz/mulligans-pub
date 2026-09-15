"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) return setErro("E-mail ou senha incorretos.");
    router.push("/admin");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 to-ink" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-orange/15 blur-[120px]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm card-rustic p-8 animate-rise"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="The Mulligan's Pub"
            width={84}
            height={84}
            className="mx-auto mb-4 w-auto h-auto rounded-full ring-1 ring-green/40"
          />
          <h1 className="font-display text-4xl text-orange-glow mb-1">The Mulligan&apos;s</h1>
          <p className="text-green-light text-xs uppercase tracking-[0.3em]">
            Painel Administrativo
          </p>
        </div>

        <label className="block text-sm mb-1 text-bone-dim">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-charcoal border border-green/25 rounded-md px-3 py-2.5 mb-4 text-bone outline-none focus:border-orange transition"
        />

        <label className="block text-sm mb-1 text-bone-dim">Senha</label>
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full bg-charcoal border border-green/25 rounded-md px-3 py-2.5 mb-4 text-bone outline-none focus:border-orange transition"
        />

        {erro && <p className="text-orange-light text-sm mb-3">{erro}</p>}

        <button
          disabled={loading}
          className="btn-primary hover:btn-primary-hover w-full disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
