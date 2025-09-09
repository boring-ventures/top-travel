import Header from "@/components/views/landing-page/Header";
import Footer from "@/components/views/landing-page/Footer";
import About from "@/components/views/landing-page/About";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <About />
      <Footer />
    </div>
  );
}
