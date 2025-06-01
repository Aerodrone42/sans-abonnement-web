
import Header from "../components/Header";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import TechDemo from "../components/TechDemo";
import ProcessSteps from "../components/ProcessSteps";
import Testimonials from "../components/Testimonials";
import Examples from "../components/Examples";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WhyChooseUs />
      <TechDemo />
      <ProcessSteps />
      <Testimonials />
      <Examples />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
