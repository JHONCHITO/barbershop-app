// app/reservas/page.tsx  (server component)
import Reservas from "@/components/reservas";

type Search = {
  barbero?: string;
  barberia?: "principal" | "norte" | "sur" | "todas";
};

export default function ReservasPublicPage({
  searchParams,
}: { searchParams?: Search }) {
  return (
    <Reservas
      preselectBarbero={searchParams?.barbero}
      preselectBarberia={searchParams?.barberia}
      // no pasamos isAdmin => vista cliente
    />
  );
}
