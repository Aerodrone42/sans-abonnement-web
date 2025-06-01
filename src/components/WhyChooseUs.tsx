
import { useState, useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Globe, Rocket, Brain, Sparkles, Eye } from "lucide-react";

const WhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "IA QUANTIQUE",
      subtitle: "Intelligence Artificielle Révolutionnaire",
      description: "Algorithmes quantiques qui anticipent les besoins de vos utilisateurs avec une précision surhumaine",
      color: "from-cyan-400 via-blue-500 to-purple-600",
      particles: 150,
      glow: "cyan"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "VITESSE LUMIÈRE",
      subtitle: "Performance Transcendante",
      description: "Technologie de compression temporelle pour un chargement instantané qui défie les lois de la physique",
      color: "from-yellow-400 via-orange-500 to-red-600",
      particles: 200,
      glow: "orange"
    },
    {
      icon: <Eye className="w-12 h-12" />,
      title: "DESIGN 4D",
      subtitle: "Interface Multi-Dimensionnelle",
      description: "Expériences utilisateur qui transcendent les dimensions traditionnelles du web",
      color: "from-purple-400 via-pink-500 to-red-600",
      particles: 120,
      glow: "purple"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "SÉCURITÉ ABSOLUE",
      subtitle: "Protection Quantique",
      description: "Cryptage quantique inviolable qui protège vos données dans toutes les dimensions",
      color: "from-green-400 via-emerald-500 to-teal-600",
      particles: 100,
      glow: "emerald"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "MULTI-DIMENSION",
      subtitle: "Réalité Augmentée Web",
      description: "Expériences immersives qui fusionnent le digital et la réalité dans un continuum",
      color: "from-indigo-400 via-purple-500 to-pink-600",
      particles: 180,
      glow: "indigo"
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "FUTUR-READY",
      subtitle: "Technologie de Demain",
      description: "Architectures évolutives qui s'adaptent automatiquement aux innovations futures",
      color: "from-pink-400 via-rose-500 to-purple-600",
      particles: 160,
      glow: "pink"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-40 bg-black relative overflow-hidden min-h-screen"
    >
      {/* Dynamic Holographic Grid */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate3d(${mousePosition.x * 30}px, ${mousePosition.y * 30}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`
          }}
        />
      </div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              transform: `translate3d(${mousePosition.x * (Math.random() * 200 - 100)}px, ${mousePosition.y * (Math.random() * 200 - 100)}px, 0)`,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px rgba(6,182,212,0.8)`
            }}
          />
        ))}
      </div>

      {/* Radial Energy Fields */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.4),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.4),transparent_50%),radial-gradient(circle_at_40%_20%,rgba(16,185,129,0.3),transparent_60%)] animate-pulse-glow"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Ultra-Futuristic Header */}
        <div className="text-center mb-32">
          <div className="relative inline-block mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative inline-flex items-center gap-6 px-16 py-8 rounded-full bg-black/60 backdrop-blur-2xl border border-cyan-400/60 shadow-2xl shadow-cyan-500/50">
              <Globe className="w-10 h-10 text-cyan-400 animate-spin" />
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-[0.3em]">
                TECHNOLOGIES TRANSCENDANTES
              </span>
              <Cpu className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-8xl md:text-[12rem] font-black text-white mb-20 leading-none">
            <div className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-2xl">
                TRANSCENDEZ
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white blur-3xl opacity-50">
                TRANSCENDEZ
              </div>
            </div>
            <br />
            <div className="relative mt-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 animate-glow drop-shadow-2xl">
                LA RÉALITÉ DIGITALE
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 blur-3xl opacity-60 animate-glow">
                LA RÉALITÉ DIGITALE
              </div>
            </div>
          </h2>

          <p className="text-3xl text-gray-300 max-w-6xl mx-auto leading-relaxed backdrop-blur-xl bg-white/5 p-12 rounded-3xl border border-cyan-400/40 shadow-2xl">
            Rejoignez l'élite technologique avec des sites web qui redéfinissent les lois de
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold text-4xl">
              l'univers digital
            </span>
          </p>
        </div>

        {/* Quantum Feature Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-black/50 backdrop-blur-2xl border border-cyan-400/40 p-10 rounded-3xl transition-all duration-1000 transform hover:-translate-y-16 hover:scale-110 hover:rotate-2 cursor-pointer ${
                activeCard === index ? 'scale-105 shadow-2xl shadow-cyan-500/60' : ''
              }`}
              onMouseEnter={() => setActiveCard(index)}
              style={{
                transform: `
                  perspective(1200px) 
                  rotateX(${mousePosition.y * 15 - 7.5}deg) 
                  rotateY(${mousePosition.x * 15 - 7.5}deg)
                  translateZ(${activeCard === index ? '80px' : '0px'})
                `,
                boxShadow: activeCard === index 
                  ? `0 0 120px rgba(6,182,212,1), inset 0 0 60px rgba(6,182,212,0.2)` 
                  : '0 0 60px rgba(6,182,212,0.4)'
              }}
            >
              {/* Holographic Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-40 rounded-3xl transition-all duration-1000 blur-2xl`}></div>
              
              {/* Quantum Particle System */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(feature.particles / 15)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 bg-gradient-to-r ${feature.color} rounded-full animate-float opacity-30 group-hover:opacity-90`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${2 + Math.random() * 4}s`,
                      boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(6,182,212,0.8)`
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Quantum Icon */}
                <div className="relative mb-12">
                  <div className={`relative bg-gradient-to-r ${feature.color} w-28 h-28 rounded-3xl flex items-center justify-center text-white mb-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-1000 shadow-2xl`}>
                    {feature.icon}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse`}></div>
                  </div>
                  
                  {/* Orbital elements */}
                  <div className="absolute -top-6 -right-6 w-6 h-6 bg-cyan-400 rounded-full animate-ping group-hover:w-8 group-hover:h-8 transition-all duration-500"></div>
                  <div className="absolute -bottom-6 -left-6 w-4 h-4 bg-purple-400 rounded-full animate-pulse group-hover:w-6 group-hover:h-6 transition-all duration-500"></div>
                  <div className="absolute top-1/2 -right-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce group-hover:w-5 group-hover:h-5 transition-all duration-500"></div>
                </div>

                <div className="text-sm text-cyan-400 font-black tracking-[0.4em] mb-6 group-hover:text-cyan-300 transition-colors duration-500">
                  {feature.subtitle}
                </div>

                <h3 className="text-3xl font-black text-white mb-8 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-500 mb-8">
                  {feature.description}
                </p>

                {/* Quantum Progress Bar */}
                <div className="relative">
                  <div className={`w-20 h-3 bg-gradient-to-r ${feature.color} rounded-full opacity-60 group-hover:opacity-100 group-hover:w-full transition-all duration-1000`}></div>
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-transparent to-white/20 rounded-full group-hover:animate-pulse"></div>
                </div>
              </div>

              {/* Holographic Corners */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 group-hover:border-cyan-300 group-hover:w-12 group-hover:h-12 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-400/60 group-hover:border-purple-300 group-hover:w-12 group-hover:h-12 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Quantum Energy Visualization */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-3xl"></div>
          <div className="relative bg-black/70 backdrop-blur-2xl border border-cyan-400/60 p-16 rounded-3xl text-center overflow-hidden shadow-2xl">
            {/* Energy Scanlines */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
              <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-6xl md:text-8xl font-black text-white mb-12 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-glow">
                  ENTRER DANS LE FUTUR
                </span>
              </h3>

              <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
                Votre vision mérite une réalisation qui transcende les dimensions conventionnelles du web
              </p>

              {/* Quantum Badges */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {[
                  "IA Quantique", "Vitesse Lumière", "Design 4D", 
                  "Sécurité Absolue", "Multi-Dimension", "Futur-Ready"
                ].map((badge, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-400/50 px-8 py-4 rounded-full text-cyan-300 font-bold text-lg hover:text-white transition-colors duration-500 hover:scale-110 transform">
                      {badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
