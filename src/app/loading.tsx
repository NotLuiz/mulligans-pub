export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-full border-2 border-green/30 border-t-orange animate-spin" />
      <p className="text-bone-dim text-sm tracking-widest uppercase">Carregando...</p>
    </div>
  );
}
