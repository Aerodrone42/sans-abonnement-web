
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-20 min-h-screen bg-gradient-to-br from-primary via-dark-blue to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Votre site internet professionnel,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-turquoise">
              sans abonnement, sans engagement
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Création de sites vitrines sur mesure pour artisans, commerçants et indépendants. 
            Paiement en une fois, hébergement inclus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button 
              onClick={scrollToContact}
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Demandez votre devis gratuit
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir nos réalisations
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
          <ArrowDown className="w-8 h-8 text-white/70" />
        </div>
      </div>
      
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-turquoise/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
    </section>
  );
};

export default Hero;
