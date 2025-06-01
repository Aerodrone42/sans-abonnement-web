
import { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, Cpu, Rocket, Code2, Globe, Eye, Star } from "lucide-react";

const Portfolio = () => {
  const [activeDemo, setActiveDemo] = useState(0);
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

  const demos = [
    {
      title: "RÉALITÉ AUGMENTÉE WEB",
      subtitle: "Interface 4D Interactive",
      description: "Explorez des dimensions parallèles avec notre technologie web révolutionnaire",
      icon: <Eye className="w-12 h-12" />,
      color: "from-cyan-400 via-blue-500 to-purple-600",
      particles: 150
    },
    {
      title: "IA QUANTIQUE DESIGN",
      subtitle: "Génération Automatique",
      description: "L'intelligence artificielle crée et optimise votre design en temps réel",
      icon: <Cpu className="w-12 h-12" />,
      color: "from-purple-400 via-pink-500 to-red-600",
      particles: 200
    },
    {
      title: "HOLOGRAMMES WEB",
      subtitle: "Projection 3D Virtuelle",
      description: "Vos contenus flottent dans l'espace avec une physique réaliste",
      icon: <Sparkles className="w-12 h-12" />,
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      particles: 100
    },
    {
      title: "VITESSE LUMIÈRE",
      subtitle: "Performance Transcendante",
      description: "Chargement instantané grâce à notre technologie de compression temporelle",
      icon: <Zap className="w-12 h-12" />,
      color: "from-yellow-400 via-orange-500 to-pink-600",
      particles: 300
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="py-40 bg-black relative overflow-hidden min-h-screen"
    >
      {/* Holographic Grid Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
          }}
        />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              transform: `translate3d(${mousePosition.x * (Math.random() * 100 - 50)}px, ${mousePosition.y * (Math.random() * 100 - 50)}px, 0)`
            }}
          />
        ))}
      </div>

      {/* Radial Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.3),transparent_40%)] animate-pulse-glow"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Ultra-Modern Header */}
        <div className="text-center mb-32">
          <div className="relative inline-block mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative inline-flex items-center gap-4 px-12 py-6 rounded-full bg-black/50 backdrop-blur-xl border border-cyan-400/50 shadow-2xl shadow-cyan-500/25">
              <Globe className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-widest">
                DÉMONSTRATION TECHNOLOGIQUE
              </span>
              <Star className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-7xl md:text-9xl font-black text-white mb-16 leading-none">
            <div className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
                EXPÉRIENCE
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white blur-2xl opacity-50">
                EXPÉRIENCE
              </div>
            </div>
            <br />
            <div className="relative mt-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 animate-glow">
                TRANSCENDANTE
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-60 animate-glow">
                TRANSCENDANTE
              </div>
            </div>
          </h2>

          <p className="text-2xl text-gray-300 max-w-6xl mx-auto leading-relaxed backdrop-blur-xl bg-white/5 p-10 rounded-3xl border border-cyan-400/30 shadow-2xl">
            Plongez dans une démonstration révolutionnaire de nos capacités technologiques. 
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
              Chaque interaction redéfinit les possibilités du web moderne.
            </span>
          </p>
        </div>

        {/* 4D Interactive Demo Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-32">
          {demos.map((demo, index) => (
            <div
              key={index}
              className={`group relative bg-black/40 backdrop-blur-xl border border-cyan-400/30 p-12 rounded-3xl transition-all duration-1000 transform hover:-translate-y-12 hover:scale-110 hover:rotate-3 cursor-pointer ${
                activeDemo === index ? 'scale-105 shadow-2xl shadow-cyan-500/50' : ''
              }`}
              onClick={() => setActiveDemo(index)}
              onMouseEnter={() => setActiveDemo(index)}
              style={{
                transform: `
                  perspective(1000px) 
                  rotateX(${mousePosition.y * 10 - 5}deg) 
                  rotateY(${mousePosition.x * 10 - 5}deg)
                  translateZ(${activeDemo === index ? '50px' : '0px'})
                `,
                boxShadow: activeDemo === index 
                  ? '0 0 100px rgba(6,182,212,0.8), inset 0 0 50px rgba(6,182,212,0.1)' 
                  : '0 0 50px rgba(6,182,212,0.3)'
              }}
            >
              {/* Holographic Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-30 rounded-3xl transition-all duration-1000 blur-xl`}></div>
              
              {/* Particle System */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(demo.particles / 10)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 bg-gradient-to-r ${demo.color} rounded-full animate-float opacity-40 group-hover:opacity-80`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Animated Icon */}
                <div className="relative mb-10">
                  <div className={`relative bg-gradient-to-r ${demo.color} w-24 h-24 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-150 group-hover:rotate-12 transition-all duration-1000 shadow-2xl`}>
                    {demo.icon}
                    <div className={`absolute inset-0 bg-gradient-to-r ${demo.color} rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse`}></div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-cyan-400 rounded-full animate-ping group-hover:w-6 group-hover:h-6 transition-all duration-500"></div>
                  <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse group-hover:w-5 group-hover:h-5 transition-all duration-500"></div>
                </div>

                <div className="text-sm text-cyan-400 font-black tracking-[0.3em] mb-4 group-hover:text-cyan-300 transition-colors duration-500">
                  {demo.subtitle}
                </div>

                <h3 className="text-3xl font-black text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
                  {demo.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-500">
                  {demo.description}
                </p>

                {/* Interactive Elements */}
                <div className="mt-8 flex items-center gap-4">
                  <div className={`w-16 h-2 bg-gradient-to-r ${demo.color} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <span className="text-cyan-400 text-sm font-bold group-hover:text-cyan-300 transition-colors duration-500">
                    EXPLORER →
                  </span>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-300 group-hover:w-8 group-hover:h-8 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-purple-400/50 group-hover:border-purple-300 group-hover:w-8 group-hover:h-8 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Ultra-Futuristic CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-3xl"></div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-400/50 p-20 rounded-3xl text-center overflow-hidden shadow-2xl">
            {/* Animated Scanlines */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
              <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black text-white mb-12 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-glow">
                  CRÉONS ENSEMBLE
                </span>
                <br />
                <span className="text-white mt-4 block">
                  L'IMPOSSIBLE
                </span>
              </h3>

              <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
                Votre vision mérite une réalisation qui transcende les dimensions conventionnelles du web
              </p>

              {/* Holographic Button */}
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl px-16 py-8 rounded-2xl font-black shadow-2xl hover:scale-110 hover:rotate-1 transition-all duration-500 border-2 border-cyan-300/50 hover:border-cyan-200 group-hover:shadow-cyan-400/50"
                >
                  <Rocket className="inline mr-4 w-8 h-8 animate-bounce" />
                  TRANSCENDER LA RÉALITÉ
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 rounded-2xl transition-all duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
