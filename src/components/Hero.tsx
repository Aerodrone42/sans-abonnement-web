

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Zap, Code2 } from "lucide-react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 md:w-64 md:h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 md:w-64 md:h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full animate-rotate-slow"></div>
        
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Mouse follower effect */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center pt-32">
          {/* Titre principal moderne avec effet holographique - TAILLE AUGMENTÉE */}
          <div className={`transition-all duration-1000 mb-16 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Lignes de scan animées */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-1 animate-slide-in-right" style={{animationDuration: '3s', animationIterationCount: 'infinite'}}></div>
              
              {/* Titre principal avec effet moderne - TAILLE CONSIDÉRABLEMENT AUGMENTÉE */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-mono font-bold text-white mb-4 relative">
                <span className="relative bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent animate-pulse">
                  CRÉATION DE SITES WEB HAUT DE GAMME
                  
                  {/* Effet de lueur holographique */}
                  <span className="absolute inset-0 text-cyan-400/30 animate-lightning-glow">
                    CRÉATION DE SITES WEB HAUT DE GAMME
                  </span>
                  <span className="absolute inset-0 text-purple-400/20 animate-lightning-glow" style={{animationDelay: '0.5s'}}>
                    CRÉATION DE SITES WEB HAUT DE GAMME
                  </span>
                </span>
              </h1>

              {/* Éléments décoratifs technologiques */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 animate-pulse"></div>
                <Code2 className="w-4 h-4 text-cyan-400 animate-bounce-slow" />
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400 animate-pulse"></div>
              </div>

              {/* Bordure holographique */}
              <div className="absolute -inset-4 border border-cyan-400/30 animate-pulse" style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}></div>
            </div>
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              <span className="text-cyan-400 font-semibold">Pas d'abonnement</span>
              {" • "}
              <span className="text-purple-400 font-semibold">Design Luxe</span>
              {" • "}
              <span className="text-cyan-400 font-semibold">4 jours minimum</span>
            </p>
          </div>

          {/* Features grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { icon: <Rocket className="w-6 h-6" />, title: "Livraison Premium", desc: "4 jours minimum", gradient: "from-red-400 to-pink-500" },
              { icon: <Sparkles className="w-6 h-6" />, title: "Design Luxe", desc: "Interface exclusive", gradient: "from-cyan-400 to-blue-500" },
              { icon: <Zap className="w-6 h-6" />, title: "Performance", desc: "Ultra-rapide", gradient: "from-purple-400 to-violet-500" }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 group-hover:border-white/30 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl mb-4 inline-block group-hover:animate-pulse`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col md:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <Button 
                onClick={scrollToContact}
                className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-6 rounded-2xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-110 border-2 border-cyan-300/50 hover:border-cyan-200 text-lg"
              >
                <Rocket className="mr-3 w-5 h-5 animate-bounce" />
                Démarrer Mon Projet
              </Button>
            </div>
          </div>

          {/* Stats section */}
          <div className={`mt-16 grid grid-cols-3 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "150+", label: "Sites Créés", gradient: "from-cyan-400 to-blue-500" },
              { number: "98%", label: "Satisfaction", gradient: "from-purple-400 to-pink-500" },
              { number: "2000€+", label: "À partir de", gradient: "from-green-400 to-emerald-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:animate-pulse`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

