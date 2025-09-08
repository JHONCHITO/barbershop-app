"use client";

import { createReserva } from "@/lib/api/reservas";
// si usas algún toast, impórtalo aquí

export default function Confirmar({ payload }: { payload: any }) {
  async function onSubmit() {
    try {
      const r = await createReserva(payload);
      // toast.success("Reserva creada");
      console.log("OK", r);
    } catch (err: any) {
      console.error("create reserva →", err?.message);
      // toast.error(err?.message || "No se pudo crear la reserva");
    }
  }

  return (
    <button onClick={onSubmit} className="btn-primary">
      Crear Reserva
    </button>
  );
}
