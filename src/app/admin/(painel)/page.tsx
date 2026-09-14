"use client";
import Link from "next/link";

export default function AdminHome() {
  const cards = [
    {
      href: "/admin/eventos",
      emoji: "🎸",
      titulo: "Eventos",
      desc: "Adicionar, editar e remover shows e eventos.",
    },
    {
      href: "/admin/galeria",
      emoji: "📸",
      titulo: "Galeria",
      desc: "Subir fotos novas e organizar por categoria.",
    },
    {
      href: "/admin/configuracoes",
      emoji: "⚙️",
      titulo: "Configurações",
      desc: "Editar link do cardápio, endereço, redes sociais.",
    },
  ];

  return (
    <div className="animate-rise">
      <span className="kicker mb-3">
        <span className="h-px w-6 bg-green-light" />
        Bem-vindo
      </span>
      <h1 className="font-display text-5xl md:text-6xl text-bone mb-2">Bem-vindo! 🍻</h1>
      <p className="text-bone-dim mb-10">O que vamos atualizar hoje?</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card-rustic hover:card-rustic-hover p-6 group block"
          >
            <div className="text-4xl mb-4">{c.emoji}</div>
            <h2 className="font-display text-3xl text-bone mb-1 group-hover:text-orange-light transition">
              {c.titulo}
            </h2>
            <p className="text-bone-dim text-sm">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
