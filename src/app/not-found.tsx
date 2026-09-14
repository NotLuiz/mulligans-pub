import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="kicker justify-center">
        <span className="h-px w-8 bg-green-light" />
        404
        <span className="h-px w-8 bg-green-light" />
      </span>
      <h1 className="font-display text-6xl md:text-7xl text-grunge">
        Essa rodada <span className="text-green-glow">acabou</span>
      </h1>
      <p className="text-bone-dim max-w-md">
        A página que você procura não existe. Mas o balcão continua aberto.
      </p>
      <Link href="/" className="btn-primary hover:btn-primary-hover">
        Voltar para a Home
      </Link>
    </div>
  );
}
