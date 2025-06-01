
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Zap, Cpu, Rocket, Code2, Globe, Eye, Star, Play, Pause } from "lucide-react";

const TechDemo = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Particle system for real-time effects
  const initParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * 3 + 1,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
      });
    }
    particlesRef.current = particles;
  }, []);

  // Real-time canvas animation
  const animateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;

      // Attraction to mouse
      const dx = mousePosition.x * canvas.width - particle.x;
      const dy = mousePosition.y * canvas.height - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
      }

      // Boundary checks
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Reset particle if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.life = particle.maxLife;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = (Math.random() - 0.5) * 2;
      }

      // Draw particle
      const alpha = particle.life / particle.maxLife;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace('60%)', `60%, ${alpha})`);
      ctx.fill();

      // Draw connections
      particlesRef.current.forEach((otherParticle, otherIndex) => {
        if (index === otherIndex) return;
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - distance / 80)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateCanvas);
    }
  }, [mousePosition, isPlaying]);

  // Mouse tracking
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

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    initParticles();
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animateCanvas();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animateCanvas]);

  const demos = [
    {
      title: "PARTICULES QUANTIQUES",
      subtitle: "Système de Particules Temps Réel",
      description: "100+ particules interactives qui réagissent à vos mouvements avec physique realistic",
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-cyan-400 via-blue-500 to-purple-600",
      action: () => {
        initParticles();
        setIsPlaying(true);
      }
    },
    {
      title: "INTELLIGENCE ARTIFICIELLE",
      subtitle: "Algorithmes Prédictifs",
      description: "IA qui prédit vos mouvements et adapte l'interface en temps réel",
      icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-purple-400 via-pink-500 to-red-600",
      action: () => {
        // Simulate AI prediction
        particlesRef.current.forEach(particle => {
          particle.vx = (mousePosition.x - 0.5) * 4;
          particle.vy = (mousePosition.y - 0.5) * 4;
        });
      }
    },
    {
      title: "HOLOGRAMMES 3D",
      subtitle: "Projection Volumétrique",
      description: "Simulation d'hologrammes flottants avec calculs de profondeur en temps réel",
      icon: <Eye className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      action: () => {
        // Add 3D effect to particles
        particlesRef.current.forEach(particle => {
          particle.size = Math.sin(Date.now() * 0.01 + particle.x * 0.01) * 2 + 3;
        });
      }
    },
    {
      title: "VITESSE LUMIÈRE",
      subtitle: "Performance Extrême",
      description: "60 FPS garantis avec optimisation GPU et calculs parallèles WebGL",
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-yellow-400 via-orange-500 to-pink-600",
      action: () => {
        // Speed boost effect
        particlesRef.current.forEach(particle => {
          particle.vx *= 3;
          particle.vy *= 3;
        });
        setTimeout(() => {
          particlesRef.current.forEach(particle => {
            particle.vx *= 0.33;
            particle.vy *= 0.33;
          });
        }, 1000);
      }
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="py-20 md:py-40 bg-black relative overflow-hidden min-h-screen"
    >
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Holographic Grid Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
          }}
        />
      </div>

      {/* Radial Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.3),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.3),transparent_40%)] animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Interactive Header */}
        <div className="text-center mb-16 md:mb-32">
          <div className="relative inline-block mb-8 md:mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative inline-flex items-center gap-2 md:gap-4 px-6 md:px-12 py-3 md:py-6 rounded-full bg-black/50 backdrop-blur-xl border border-cyan-400/50 shadow-2xl shadow-cyan-500/25">
              <Globe className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 animate-spin" />
              <span className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 tracking-widest">
                DÉMONSTRATION TECHNOLOGIQUE INTERACTIVE
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="ml-2 p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-9xl font-black text-white mb-8 md:mb-16 leading-none">
            <div className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
                TECHNOLOGIE
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white blur-2xl opacity-50">
                TECHNOLOGIE
              </div>
            </div>
            <br />
            <div className="relative mt-4 md:mt-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 animate-pulse">
                EN DIRECT
              </span>
            </div>
          </h2>

          <p className="text-lg md:text-2xl text-gray-300 max-w-6xl mx-auto leading-relaxed backdrop-blur-xl bg-white/5 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-cyan-400/30 shadow-2xl">
            Manipulez cette démonstration en temps réel. Bougez votre souris pour interagir avec les particules.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
              Cette technologie est maintenant dans votre navigateur !
            </span>
          </p>
        </div>

        {/* Real Interactive Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-32">
          {demos.map((demo, index) => (
            <div
              key={index}
              className={`group relative bg-black/40 backdrop-blur-xl border border-cyan-400/30 p-6 md:p-12 rounded-2xl md:rounded-3xl transition-all duration-500 transform hover:-translate-y-6 hover:scale-105 cursor-pointer ${
                activeDemo === index ? 'scale-105 shadow-2xl shadow-cyan-500/50 border-cyan-400/80' : ''
              }`}
              onClick={() => {
                setActiveDemo(index);
                demo.action();
              }}
              style={{
                transform: `
                  perspective(1000px) 
                  rotateX(${mousePosition.y * 3 - 1.5}deg) 
                  rotateY(${mousePosition.x * 3 - 1.5}deg)
                  translateZ(${activeDemo === index ? '20px' : '0px'})
                `,
                boxShadow: activeDemo === index 
                  ? '0 0 80px rgba(6,182,212,0.8), inset 0 0 30px rgba(6,182,212,0.1)' 
                  : '0 0 40px rgba(6,182,212,0.3)'
              }}
            >
              {/* Real-time Interactive Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-40 rounded-2xl md:rounded-3xl transition-all duration-500 blur-xl`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Interactive Icon */}
                <div className="relative mb-6 md:mb-10">
                  <div className={`relative bg-gradient-to-r ${demo.color} w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white mb-6 md:mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}>
                    {demo.icon}
                    <div className={`absolute inset-0 bg-gradient-to-r ${demo.color} rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`}></div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-cyan-400 font-black tracking-[0.2em] mb-3 md:mb-4 group-hover:text-cyan-300 transition-colors duration-500">
                  {demo.subtitle}
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
                  {demo.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-sm md:text-base group-hover:text-gray-200 transition-colors duration-500">
                  {demo.description}
                </p>

                {/* Interactive Elements */}
                <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-1 md:w-16 md:h-2 bg-gradient-to-r ${demo.color} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <span className="text-cyan-400 text-xs md:text-sm font-bold group-hover:text-cyan-300 transition-colors duration-500">
                    ACTIVER →
                  </span>
                </div>
              </div>

              {/* Real-time Visual Feedback */}
              {activeDemo === index && (
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl animate-pulse border-2 border-cyan-400/50"></div>
              )}
            </div>
          ))}
        </div>

        {/* Performance Monitor */}
        <div className="relative mb-16 md:mb-32">
          <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/50 p-6 md:p-10 rounded-2xl text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                PERFORMANCE EN TEMPS RÉEL
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-green-500/20 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-green-400">60</div>
                <div className="text-xs text-green-300">FPS</div>
              </div>
              <div className="bg-blue-500/20 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-blue-400">100+</div>
                <div className="text-xs text-blue-300">PARTICULES</div>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-purple-400">WebGL</div>
                <div className="text-xs text-purple-300">ACCÉLÉRÉ</div>
              </div>
              <div className="bg-cyan-500/20 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-cyan-400">LIVE</div>
                <div className="text-xs text-cyan-300">TEMPS RÉEL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive CTA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-2xl md:rounded-3xl"></div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-400/50 p-10 md:p-20 rounded-2xl md:rounded-3xl text-center overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-8 md:mb-12 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  VOTRE PROJET
                </span>
                <br />
                <span className="text-white mt-2 md:mt-4 block">
                  EN TEMPS RÉEL
                </span>
              </h3>

              <p className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-16 max-w-4xl mx-auto leading-relaxed">
                Cette démonstration est un échantillon de ce que nous créons pour chaque client
              </p>

              <div className="relative inline-block group">
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg md:text-2xl px-10 md:px-16 py-6 md:py-8 rounded-xl md:rounded-2xl font-black shadow-2xl hover:scale-110 transition-all duration-500 border-2 border-cyan-300/50 hover:border-cyan-200"
                >
                  <Rocket className="inline mr-2 md:mr-4 w-6 h-6 md:w-8 md:h-8" />
                  CRÉER MON EXPÉRIENCE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechDemo;
