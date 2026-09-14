import EventoForm from "@/components/admin/EventoForm";

export default async function EditarEvento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1 className="font-display text-4xl text-white mb-6">Editar Evento</h1>
      <EventoForm id={id} />
    </div>
  );
}