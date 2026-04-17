import LayoutWrapper from "@/components/LayoutWrapper";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueSection from "@/components/ValueSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <LayoutWrapper>
        <Header />
        <Hero />
        <ValueSection />
        <CTASection />
        <Footer />
      </LayoutWrapper>
    </main>
  );
}
