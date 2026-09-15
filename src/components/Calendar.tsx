"use client";
import { useState } from "react";
import {
  startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay,
  addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth, isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarHoraEvento, TIMEZONE } from "@/lib/site";
import BotaoSympla from "@/components/BotaoSympla";

type Evento = {
  id: string; titulo: string; descricao?: string; data: string;
  imagem_url?: string; link_sympla?: string;
};

/**
 * Converte uma data ISO (UTC) para um objeto Date "deslocado" para o
 * fuso de Brasília. Assim, `isSameDay` e `format` do date-fns (que usam
 * o fuso local do navegador) comparam o dia correto do calendário.
 */
function paraFusoLocal(iso: string): Date {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return d;
  // Descobre o offset do fuso do pub naquele instante e aplica.
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  const sp = new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }));
  const diff = sp.getTime() - utc.getTime();
  return new Date(d.getTime() + diff);
}

export default function Calendar({ eventos }: { eventos: Evento[] }) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventosDoDia = (day: Date) =>
    eventos.filter((e) => isSameDay(paraFusoLocal(e.data), day));

  const eventosSelecionados = selected
    ? eventos.filter((e) => isSameDay(paraFusoLocal(e.data), selected))
    : [];

  return (
    <div className="card-rustic p-6 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6">
        <button
          aria-label="Mês anterior"
          onClick={() => setCurrent(subMonths(current, 1))}
          className="w-9 h-9 rounded-full border border-green/30 text-green-light hover:bg-orange hover:border-orange hover:text-white transition"
        >
          ←
        </button>
        <h3 className="font-display text-2xl capitalize text-bone">
          {format(current, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <button
          aria-label="Próximo mês"
          onClick={() => setCurrent(addMonths(current, 1))}
          className="w-9 h-9 rounded-full border border-green/30 text-green-light hover:bg-orange hover:border-orange hover:text-white transition"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-widest text-green-light/70 mb-3">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const evs = eventosDoDia(day);
          const inMonth = isSameMonth(day, current);
          const isSel = selected && isSameDay(day, selected);
          const today = isToday(day);
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelected(day)}
              aria-label={format(day, "dd 'de' MMMM", { locale: ptBR })}
              className={`
                aspect-square rounded-lg text-sm flex flex-col items-center justify-center relative transition
                ${!inMonth ? "text-bone-dim/25" : "text-bone hover:bg-charcoal-light"}
                ${isSel ? "bg-orange text-white shadow-[0_0_20px_-4px_rgba(249,115,22,0.9)]" : ""}
                ${today && !isSel ? "ring-1 ring-green-light/60" : ""}
              `}
            >
              <span>{format(day, "d")}</span>
              {evs.length > 0 && (
                <span
                  className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                    isSel ? "bg-white" : "bg-orange"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 border-t border-green/20 pt-5">
          <p className="text-green-light text-xs uppercase font-semibold tracking-widest mb-3">
            {format(selected, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
          {eventosSelecionados.length === 0 ? (
            <p className="text-bone-dim text-sm">Nenhum evento neste dia.</p>
          ) : (
            <div className="space-y-3">
              {eventosSelecionados.map((ev) => (
                <div key={ev.id} className="bg-charcoal rounded-lg p-4 border border-green/15">
                  <p className="font-display text-xl text-bone">{ev.titulo}</p>
                  <p className="text-xs text-bone-dim mb-3">
                    {formatarHoraEvento(ev.data)}
                    {ev.descricao ? ` — ${ev.descricao}` : ""}
                  </p>
                  {ev.link_sympla && (
                    <BotaoSympla
                      eventoId={ev.id}
                      href={ev.link_sympla}
                      className="btn-primary hover:btn-primary-hover text-xs !py-1.5 !px-3"
                    >
                      Comprar no Sympla
                    </BotaoSympla>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
