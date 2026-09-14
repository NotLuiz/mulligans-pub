"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
      <h1 className="font-display text-5xl text-orange-glow">Ops!</h1>
      <p className="text-bone-dim max-w-md">
        Algo deu errado ao carregar esta página. Tente novamente em instantes.
      </p>
      <button onClick={reset} className="btn-primary hover:btn-primary-hover">
        Tentar novamente
      </button>
    </div>
  );
}
