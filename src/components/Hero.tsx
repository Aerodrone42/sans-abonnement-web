
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Code, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-20 min-h-screen relative overflow-hidden bg-black">
      {/* Holographic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse opacity-30"></div>
      
      {/* Dynamic Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Interactive Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(6,182,212,0.8), rgba(37,99,235,0.4))`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              boxShadow: `0 0 ${particle.size * 4}px rgba(6,182,212,0.6)`
            }}
          />
        ))}
      </div>

      {/* Mouse Follower Effect */}
      <div 
        className="fixed w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
      />

      {/* Animated Lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="max-w-7xl mx-auto text-center text-white">
          
          {/* 3D Floating Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/50 mb-12 animate-fade-in shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 hover:rotate-1">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 w-6 h-6 bg-cyan-400 blur-lg opacity-50 animate-pulse"></div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              ⚡ INNOVATION • TECHNOLOGIE • FUTUR ⚡
            </span>
            <div className="relative">
              <Code className="w-6 h-6 text-blue-400 animate-bounce" />
              <div className="absolute inset-0 w-6 h-6 bg-blue-400 blur-lg opacity-50 animate-bounce"></div>
            </div>
          </div>

          {/* Ultra-Modern Title with 3D Effects */}
          <h1 className="text-7xl md:text-9xl font-black mb-12 animate-fade-in leading-none tracking-tight">
            <div className="relative inline-block">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-2xl">
                SITE WEB
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white blur-lg opacity-50">
                SITE WEB
              </div>
            </div>
            <div className="relative inline-block mt-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 animate-glow drop-shadow-2xl">
                RÉVOLUTIONNAIRE
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 blur-xl opacity-60 animate-glow">
                RÉVOLUTIONNAIRE
              </div>
            </div>
            <div className="relative inline-block mt-6">
              <span className="block text-3xl md:text-5xl font-light text-gray-300 animate-pulse">
                🚀 Sans abonnement • ⚡ Sans limite • 🎯 Sans concurrence
              </span>
            </div>
          </h1>

          {/* Holographic Description */}
          <div className="relative max-w-5xl mx-auto mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl rounded-3xl"></div>
            <p className="relative text-2xl md:text-3xl mb-8 text-gray-100 animate-fade-in leading-relaxed p-8 backdrop-blur-xl border border-cyan-400/30 rounded-3xl shadow-2xl" style={{animationDelay: '0.3s'}}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-bold">
                Intelligence Artificielle • Performance Extrême • Design Futuriste
              </span>
              <br />
              Votre présence digitale redéfinie par la technologie de demain
            </p>
          </div>

          {/* Ultra-Advanced CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center animate-fade-in mb-20" style={{animationDelay: '0.6s'}}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <Button 
                onClick={scrollToContact}
                size="lg" 
                className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-2xl px-16 py-8 rounded-3xl font-black shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 border-2 border-cyan-300/50 hover:border-cyan-200"
              >
                <Zap className="mr-4 w-8 h-8 animate-bounce" />
                <span className="relative z-10">🚀 CRÉER MON EMPIRE DIGITAL</span>
              </Button>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
              <Button 
                variant="outline" 
                size="lg"
                className="relative bg-black/50 backdrop-blur-xl border-2 border-cyan-400/50 text-white hover:bg-cyan-500/20 text-2xl px-16 py-8 rounded-3xl font-black transition-all duration-500 hover:border-cyan-300 hover:scale-110"
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-500">
                  ⚡ VOIR LA MAGIE
                </span>
              </Button>
            </div>
          </div>

          {/* Holographic Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in" style={{animationDelay: '0.9s'}}>
            {[
              { number: "99.99%", label: "Uptime Garanti", icon: "⚡", color: "from-green-400 to-emerald-600" },
              { number: "<0.5s", label: "Vitesse Foudre", icon: "🚀", color: "from-cyan-400 to-blue-600" },
              { number: "∞", label: "Possibilités", icon: "⭐", color: "from-purple-400 to-pink-600" }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-40 rounded-3xl blur-xl transition-opacity duration-500`}></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 hover:border-cyan-300/60 transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-2xl">
                  <div className="text-5xl mb-4 animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>{stat.icon}</div>
                  <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2 animate-pulse`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-lg font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 3D Animated Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-black/50 backdrop-blur-xl border-2 border-cyan-400/50 rounded-full p-6 hover:border-cyan-300 transition-all duration-500 hover:scale-125 hover:rotate-12 shadow-2xl">
              <ArrowDown className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Cyberpunk Corner Effects */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-cyan-400 opacity-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-blue-400 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-purple-400 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-pink-400 opacity-50"></div>
    </section>
  );
};

export default Hero;
