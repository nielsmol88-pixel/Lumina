import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal — LÚMINA",
  description: "Información legal, política de privacidad y política de cookies de LÚMINA.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-slate-900 tracking-tight">LÚMINA</Link>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
            Información Legal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12 space-y-12">
        {/* Aviso Legal */}
        <section>
          <h1 className="font-serif text-2xl text-slate-900 mb-4">Aviso Legal</h1>
          <div className="prose prose-sm prose-slate max-w-none space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              LÚMINA es una plataforma de gestión sanitaria. Los servicios médicos son prestados
              por profesionales sanitarios independientes debidamente colegiados en el Colegio
              Oficial de Médicos de Madrid (ICOMEM). LÚMINA no ejerce actividad sanitaria directa.
            </p>
            <p>
              <span className="font-medium text-slate-700">Titular:</span> LÚMINA S.L.<br />
              <span className="font-medium text-slate-700">NIF:</span> [Pendiente de registro]<br />
              <span className="font-medium text-slate-700">Domicilio social:</span> Madrid, España<br />
              <span className="font-medium text-slate-700">Contacto:</span> hola@lumina-ophthalmology.com
            </p>
            <p>
              Los profesionales médicos que prestan servicios a través de la plataforma LÚMINA
              operan bajo contratos de arrendamiento de servicios (B2B) y disponen de su propia
              póliza de responsabilidad civil profesional (RC Médica) con cobertura mínima de 1.500.000€.
            </p>
          </div>
        </section>

        {/* Política de Privacidad */}
        <section>
          <h2 className="font-serif text-xl text-slate-900 mb-4">Política de Privacidad</h2>
          <div className="prose prose-sm prose-slate max-w-none space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              De conformidad con el Reglamento General de Protección de Datos (RGPD) y la
              Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD), le informamos:
            </p>
            <p>
              <span className="font-medium text-slate-700">Responsable del tratamiento:</span> LÚMINA S.L.<br />
              <span className="font-medium text-slate-700">Finalidad:</span> Gestión de citas médicas, comunicación con pacientes y prestación de servicios de coordinación sanitaria.<br />
              <span className="font-medium text-slate-700">Base legal:</span> Consentimiento explícito del interesado (Art. 9.2.a RGPD) para datos de salud.<br />
              <span className="font-medium text-slate-700">Destinatarios:</span> Los datos de salud son compartidos exclusivamente con el profesional médico asignado. No se transfieren datos personales a terceros fuera de la UE.<br />
              <span className="font-medium text-slate-700">Conservación:</span> Los datos se conservarán durante el tiempo necesario para la prestación del servicio y el cumplimiento de obligaciones legales (mínimo 5 años según legislación sanitaria española).<br />
              <span className="font-medium text-slate-700">Alojamiento:</span> Supabase (región EU Frankfurt, Alemania) — datos alojados exclusivamente en la Unión Europea.
            </p>
            <p className="font-medium text-slate-700">Derechos del interesado:</p>
            <p>
              Puede ejercer sus derechos de acceso, rectificación, supresión, portabilidad,
              limitación y oposición enviando un correo a hola@lumina-ophthalmology.com
              indicando &quot;Protección de Datos&quot; en el asunto. Tiene derecho a presentar una
              reclamación ante la Agencia Española de Protección de Datos (AEPD).
            </p>
          </div>
        </section>

        {/* Política de Cookies */}
        <section>
          <h2 className="font-serif text-xl text-slate-900 mb-4">Política de Cookies</h2>
          <div className="prose prose-sm prose-slate max-w-none space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Este sitio web utiliza cookies técnicas estrictamente necesarias para su funcionamiento.
              No utilizamos cookies de seguimiento ni publicitarias sin su consentimiento previo.
            </p>
            <p>
              Si se implementa Google Analytics, se utilizarán cookies analíticas con IP anonimizada
              para mejorar la experiencia del usuario. Puede desactivarlas en la configuración de su navegador.
            </p>
          </div>
        </section>

        <div className="border-t border-stone-200 pt-6">
          <Link href="/" className="text-xs text-amber-700 hover:underline">← Volver a LÚMINA</Link>
        </div>
      </main>
    </div>
  );
}
