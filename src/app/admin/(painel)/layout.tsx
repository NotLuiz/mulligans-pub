"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Início", icon: "📊" },
  { href: "/admin/eventos", label: "Eventos", icon: "🎸" },
  { href: "/admin/galeria", label: "Galeria", icon: "📸" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin/login");
      else setLoading(false);
    });
  }, [router]);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-bone-dim">
        Carregando painel...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ink">
      <aside className="md:w-64 bg-ink-soft border-b md:border-b-0 md:border-r border-green/20 p-6 flex md:flex-col justify-between md:justify-start gap-4">
        <div className="w-full">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image
              src="/logo.png"
              alt="The Mulligan's Pub"
              width={44}
              height={44}
              className="w-auto h-auto rounded-full ring-1 ring-green/40"
            />
            <span className="font-display text-2xl text-orange-glow leading-none">Painel</span>
          </Link>
          <nav className="flex md:flex-col gap-2 flex-wrap">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-lg transition flex items-center gap-2 ${
                    active
                      ? "bg-orange/15 text-orange-light border border-orange/40"
                      : "text-bone-dim hover:bg-charcoal hover:text-bone border border-transparent"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={sair}
          className="text-sm text-orange-light hover:text-green-light transition md:mt-auto whitespace-nowrap"
        >
          Sair →
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
