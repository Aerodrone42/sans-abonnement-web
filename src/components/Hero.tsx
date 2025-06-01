
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-20 min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.3)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-70"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-transparent to-cyan-400/20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"></div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-white">
          
          {/* Badge with glow effect */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Innovation • Technologie • Performance
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fade-in leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
              Votre site internet
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-pulse">
              RÉVOLUTIONNAIRE
            </span>
            <span className="block text-2xl md:text-4xl font-light mt-4 text-gray-300">
              Sans abonnement • Sans limite
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-200 animate-fade-in max-w-4xl mx-auto leading-relaxed" style={{animationDelay: '0.2s'}}>
            Technologie de pointe pour créer des sites web ultra-performants. 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold"> 
              IA intégrée, optimisation automatique, design futuriste.
            </span>
          </p>

          {/* CTA Buttons with advanced effects */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in mb-16" style={{animationDelay: '0.4s'}}>
            <Button 
              onClick={scrollToContact}
              size="lg" 
              className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl px-12 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 border-2 border-cyan-400/50 hover:border-cyan-300"
            >
              <span className="relative z-10">🚀 Lancer mon projet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 text-xl px-12 py-6 rounded-2xl font-bold transition-all duration-500 hover:border-cyan-400/50"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
                ⚡ Voir la démo
              </span>
            </Button>
          </div>

          {/* Floating stats cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
            {[
              { number: "99.9%", label: "Uptime garanti", icon: "⚡" },
              { number: "<2s", label: "Temps de chargement", icon: "🚀" },
              { number: "100%", label: "Satisfaction client", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300">
            <ArrowDown className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>
      
      {/* Advanced floating elements */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default Hero;
