import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import TrustBar from "@/components/public/TrustBar";
import FrequentTreatments from "@/components/public/FrequentTreatments";
import TrustGuarantees from "@/components/public/TrustGuarantees";
import GainGrid from "@/components/public/GainGrid";
import TechnologySection from "@/components/public/TechnologySection";
import SurgeonSection from "@/components/public/SurgeonSection";
import LifestyleSection from "@/components/public/LifestyleSection";
import FAQSection from "@/components/public/FAQSection";
import LeadForm from "@/components/public/LeadForm";
import Footer from "@/components/public/Footer";
import MobileStickyCTA from "@/components/public/MobileStickyCTA";
import WhatsAppCTA from "@/components/public/WhatsAppCTA";

export const metadata = {
  title: "LÚMINA — Oftalmología Premium en Madrid",
  description: "Cirugía láser, lentes premium y cuidado personalizado. Maestría española, precisión suiza. Consulta sin compromiso.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <FrequentTreatments />
      <TrustGuarantees />
      <GainGrid />
      <TechnologySection />
      <SurgeonSection />
      <LifestyleSection />
      <FAQSection />
      <LeadForm />
      <Footer />
      <MobileStickyCTA />
      <WhatsAppCTA />
    </main>
  );
}
