import type { Metadata } from "next";
import SegundaOpinionPage from "@/components/public/SegundaOpinionPage";

export const metadata: Metadata = {
  title: "Segunda Opinión Oftalmológica — LÚMINA Madrid",
  description: "¿No estás seguro de tu diagnóstico? Obtén una segunda opinión de autor. Sin prisas, sin presión comercial. Solo ciencia y transparencia.",
};

export default function SegundaOpinionRoute() {
  return <SegundaOpinionPage />;
}
