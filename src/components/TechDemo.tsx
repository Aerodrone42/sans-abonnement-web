import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Zap, Cpu, Rocket, Code2, Globe, Eye, Star, Play, Pause } from "lucide-react";

const TechDemo = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [explosionActive, setExplosionActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Particle system for real-time effects
  const initParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * 4 + 1,
        baseSize: Math.random() * 4 + 1, // Store base size
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
        originalVx: (Math.random() - 0.5) * 2,
        originalVy: (Math.random() - 0.5) * 2,
        trail: []
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
    ctx.fillStyle = explosionActive ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Add current position to trail
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 10) particle.trail.shift();

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= explosionActive ? 0.5 : 1;

      // Attraction to mouse
      const dx = mousePosition.x * canvas.width - particle.x;
      const dy = mousePosition.y * canvas.height - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = explosionActive ? 0.0005 : 0.0001;
        particle.vx += dx * force;
        particle.vy += dy * force;
      }

      // Boundary checks with bounce
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }

      // Reset particle if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.life = particle.maxLife;
        particle.vx = particle.originalVx;
        particle.vy = particle.originalVy;
        particle.size = particle.baseSize;
        particle.trail = [];
      }

      // Draw trail
      if (explosionActive && particle.trail.length > 1) {
        for (let i = 1; i < particle.trail.length; i++) {
          const alpha = i / particle.trail.length * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.trail[i-1].x, particle.trail[i-1].y);
          ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Calculate particle size (ensure it's never negative)
      const alpha = particle.life / particle.maxLife;
      const calculatedSize = explosionActive ? particle.size * 2 : particle.size;
      const size = Math.max(0.5, calculatedSize); // Ensure minimum size of 0.5
      
      // Glow effect
      if (explosionActive) {
        const glowSize = Math.max(1, size * 3); // Ensure glow size is at least 1
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize);
        gradient.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw particle with safe size
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fillStyle = explosionActive ? 
        `hsl(${180 + Math.sin(Date.now() * 0.01) * 60}, 90%, 70%, ${alpha})` :
        particle.color.replace('60%)', `60%, ${alpha})`);
      ctx.fill();

      // Draw connections
      particlesRef.current.forEach((otherParticle, otherIndex) => {
        if (index === otherIndex) return;
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = explosionActive ? 120 : 80;
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          const opacity = explosionActive ? 0.6 : 0.3;
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * (1 - distance / maxDistance)})`;
          ctx.lineWidth = explosionActive ? 2 : 1;
          ctx.stroke();
        }
      });
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateCanvas);
    }
  }, [mousePosition, isPlaying, explosionActive]);

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
      description: "Technologie de pointe avec 150+ particules interactives qui créent des explosions spectaculaires et des traînées lumineuses en temps réel",
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-cyan-400 via-blue-500 to-purple-600",
      isQuantum: true,
      action: () => {
        console.log('Activating quantum particles explosion');
        setExplosionActive(true);
        particlesRef.current.forEach(particle => {
          particle.vx *= 3;
          particle.vy *= 3;
          particle.size = Math.max(1, particle.baseSize * 1.5); // Ensure positive size
        });
        setTimeout(() => {
          setExplosionActive(false);
          particlesRef.current.forEach(particle => {
            particle.vx = particle.originalVx;
            particle.vy = particle.originalVy;
            particle.size = particle.baseSize;
          });
        }, 3000);
      }
    },
    {
      title: "INTELLIGENCE ARTIFICIELLE",
      subtitle: "Algorithmes Prédictifs",
      description: "IA qui organise les particules en formations géométriques complexes",
      icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-purple-400 via-pink-500 to-red-600",
      action: () => {
        console.log('Activating AI particle organization');
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Organize particles in a spiral pattern
        particlesRef.current.forEach((particle, index) => {
          const angle = (index / particlesRef.current.length) * Math.PI * 4;
          const radius = 100 + Math.sin(angle) * 50;
          const targetX = canvas.width / 2 + Math.cos(angle) * radius;
          const targetY = canvas.height / 2 + Math.sin(angle) * radius;
          
          particle.vx = (targetX - particle.x) * 0.02;
          particle.vy = (targetY - particle.y) * 0.02;
          particle.color = `hsl(${280 + index * 2}, 80%, 60%)`;
        });
        
        setTimeout(() => {
          particlesRef.current.forEach(particle => {
            particle.vx = particle.originalVx;
            particle.vy = particle.originalVy;
            particle.color = `hsl(${180 + Math.random() * 60}, 70%, 60%)`;
          });
        }, 4000);
      }
    },
    {
      title: "HOLOGRAMMES 3D",
      subtitle: "Projection Volumétrique",
      description: "Simulation 3D avec effets de profondeur et rotation en temps réel",
      icon: <Eye className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      action: () => {
        console.log('Activating 3D hologram effect');
        // Add 3D rotation effect with size safety
        particlesRef.current.forEach((particle, index) => {
          const time = Date.now() * 0.001;
          particle.originalSize = particle.size;
          
          const animate3D = () => {
            const sizeModifier = Math.sin(time + index * 0.1) * 2;
            particle.size = Math.max(0.5, particle.originalSize + sizeModifier); // Ensure positive size
            particle.color = `hsl(${160 + Math.sin(time + index * 0.1) * 30}, 80%, 70%)`;
          };
          
          const interval = setInterval(animate3D, 50);
          setTimeout(() => {
            clearInterval(interval);
            particle.size = particle.originalSize;
            particle.color = `hsl(${180 + Math.random() * 60}, 70%, 60%)`;
          }, 5000);
        });
      }
    },
    {
      title: "VITESSE LUMIÈRE",
      subtitle: "Performance Extrême",
      description: "Accélération massive avec effets de traînée et boost de vitesse",
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      color: "from-yellow-400 via-orange-500 to-pink-600",
      action: () => {
        console.log('Activating light speed effect');
        setExplosionActive(true);
        // Ultra speed boost with light trails
        particlesRef.current.forEach(particle => {
          const angle = Math.random() * Math.PI * 2;
          particle.vx = Math.cos(angle) * 8;
          particle.vy = Math.sin(angle) * 8;
          particle.color = `hsl(${45 + Math.random() * 30}, 100%, 70%)`;
        });
        
        setTimeout(() => {
          setExplosionActive(false);
          particlesRef.current.forEach(particle => {
            particle.vx = particle.originalVx;
            particle.vy = particle.originalVy;
            particle.color = `hsl(${180 + Math.random() * 60}, 70%, 60%)`;
          });
        }, 2000);
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
            Cliquez sur les démos ci-dessous pour voir des effets spectaculaires en temps réel !
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
              Chaque clic déclenche une démonstration unique !
            </span>
          </p>
        </div>

        {/* Real Interactive Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-32">
          {demos.map((demo, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-xl border p-6 md:p-12 rounded-2xl md:rounded-3xl transition-all duration-500 transform hover:-translate-y-6 hover:scale-105 cursor-pointer ${
                demo.isQuantum 
                  ? 'bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 border-cyan-300/60 shadow-2xl shadow-cyan-400/30' 
                  : 'bg-black/40 border-cyan-400/30'
              } ${
                activeDemo === index ? 'scale-105 shadow-2xl shadow-cyan-500/50 border-cyan-400/80' : ''
              }`}
              onClick={() => {
                console.log(`Activating demo ${index}: ${demo.title}`);
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
                boxShadow: demo.isQuantum 
                  ? '0 0 120px rgba(6,182,212,0.9), inset 0 0 40px rgba(6,182,212,0.2), 0 0 60px rgba(147,51,234,0.6)' 
                  : activeDemo === index 
                    ? '0 0 80px rgba(6,182,212,0.8), inset 0 0 30px rgba(6,182,212,0.1)' 
                    : '0 0 40px rgba(6,182,212,0.3)'
              }}
            >
              {/* Ultra-Modern Background for Quantum Section */}
              {demo.isQuantum && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-2xl md:rounded-3xl blur-xl animate-pulse"></div>
                  <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
                    {/* Floating quantum particles */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Holographic scanlines */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse opacity-40"></div>
                </>
              )}
              
              {/* Standard Background for other sections */}
              {!demo.isQuantum && (
                <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-40 rounded-2xl md:rounded-3xl transition-all duration-500 blur-xl`}></div>
              )}
              
              {/* Content */}
              <div className="relative z-10">
                {/* Ultra-Modern Icon for Quantum */}
                <div className="relative mb-6 md:mb-10">
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white mb-6 md:mb-8 transition-all duration-500 shadow-2xl ${
                    demo.isQuantum 
                      ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 group-hover:scale-150 group-hover:rotate-45 animate-pulse border-2 border-cyan-300/50' 
                      : `bg-gradient-to-r ${demo.color} group-hover:scale-125 group-hover:rotate-12`
                  }`}>
                    {demo.icon}
                    <div className={`absolute inset-0 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${
                      demo.isQuantum 
                        ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 animate-pulse' 
                        : `bg-gradient-to-r ${demo.color} animate-pulse`
                    }`}></div>
                    
                    {/* Quantum-specific effects */}
                    {demo.isQuantum && (
                      <>
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl opacity-30 blur-md animate-spin"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl animate-pulse"></div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`text-xs md:text-sm font-black tracking-[0.2em] mb-3 md:mb-4 transition-colors duration-500 ${
                  demo.isQuantum 
                    ? 'text-cyan-300 group-hover:text-cyan-200' 
                    : 'text-cyan-400 group-hover:text-cyan-300'
                }`}>
                  {demo.subtitle}
                </div>

                <h3 className={`text-xl md:text-2xl font-black mb-4 md:mb-6 transition-all duration-500 ${
                  demo.isQuantum 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 group-hover:from-cyan-200 group-hover:via-blue-200 group-hover:to-purple-200' 
                    : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300'
                }`}>
                  {demo.title}
                </h3>

                <p className={`leading-relaxed text-sm md:text-base transition-colors duration-500 ${
                  demo.isQuantum 
                    ? 'text-gray-200 group-hover:text-gray-100' 
                    : 'text-gray-400 group-hover:text-gray-200'
                }`}>
                  {demo.description}
                </p>

                {/* Ultra-Modern Interactive Elements for Quantum */}
                <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-1 md:w-16 md:h-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${
                    demo.isQuantum 
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse' 
                      : `bg-gradient-to-r ${demo.color}`
                  }`}></div>
                  <span className={`text-xs md:text-sm font-bold transition-colors duration-500 ${
                    demo.isQuantum 
                      ? 'text-cyan-300 group-hover:text-cyan-200' 
                      : 'text-cyan-400 group-hover:text-cyan-300'
                  }`}>
                    {demo.isQuantum ? 'ACTIVER QUANTUM →' : 'CLIQUER POUR ACTIVER →'}
                  </span>
                </div>
              </div>

              {/* Enhanced Visual Feedback for Quantum */}
              {activeDemo === index && demo.isQuantum && (
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl animate-pulse border-2 border-cyan-300/80 shadow-inner shadow-cyan-400/50"></div>
              )}
              
              {/* Standard Visual Feedback */}
              {activeDemo === index && !demo.isQuantum && (
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
                <div className="text-2xl md:text-3xl font-black text-blue-400">150+</div>
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
