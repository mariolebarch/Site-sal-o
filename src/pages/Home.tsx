import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppFloatButton } from "../components/WhatsAppFloatButton";
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Gallery } from "../components/sections/Gallery";
import { Testimonials } from "../components/sections/Testimonials";
import { LocationSection } from "../components/sections/LocationSection";

export function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <LocationSection />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
