
import { Zap, Cpu, Rocket, Crown, CheckCircle, Clock, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const ProcessSteps = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Analyse & Stratégie",
      description: "Analyse approfondie de vos besoins, définition de la stratégie digitale et validation du concept en 24h chrono.",
      duration: "24h",
      gradient: "from-purple-500 via-pink-500 to-red-500",
      particles: 60,
      expandedContent: {
        features: [
          "Audit complet de votre écosystème digital",
          "Analyse concurrentielle approfondie",
          "Définition de la roadmap technique",
          "Validation du concept avec prototypage rapide"
        ],
        tools: ["Figma", "Miro", "Analytics", "Hotjar"],
        deliverables: "Brief créatif + Wireframes + Planning détaillé"
      }
    },
    {
      icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Design Futuriste",
      description: "Création d'un design ultra-moderne avec interface révolutionnaire et expérience utilisateur exceptionnelle.",
      duration: "1-2 jours",
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      particles: 80,
      expandedContent: {
        features: [
          "Interface utilisateur révolutionnaire",
          "Animations micro-interactions avancées",
          "Design system complet et évolutif",
          "Responsive design multi-plateformes"
        ],
        tools: ["Figma", "Framer", "Lottie", "Adobe Suite"],
        deliverables: "Maquettes HD + Prototype interactif + Assets"
      }
    },
    {
      icon: <Rocket className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Développement Avancé",
      description: "Développement haute performance avec technologies de pointe, optimisation SEO et adaptation responsive.",
      duration: "1-2 jours",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      particles: 100,
      expandedContent: {
        features: [
          "Code optimisé et performant",
          "Architecture évolutive et maintenable",
          "Intégrations API avancées",
          "Tests automatisés et déploiement continu"
        ],
        tools: ["React", "TypeScript", "Tailwind", "Vite"],
        deliverables: "Code source + Documentation + Tests"
      }
    },
    {
      icon: <Crown className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Livraison Premium",
      description: "Mise en ligne professionnelle et support technique premium du lundi au samedi de 8h à 19h.",
      duration: "Immédiat",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      particles: 75,
      expandedContent: {
        features: [
          "Déploiement sur infrastructure premium",
          "Configuration SSL et optimisations",
          "Support technique réactif",
          "Maintenance et mises à jour incluses"
        ],
        tools: ["Vercel", "AWS", "Cloudflare", "Analytics"],
        deliverables: "Site en ligne + Accès admin + Documentation"
      }
    }
  ];

  return (
    <section id="process" className="py-16 md:py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-10 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-radial from-blue-500/20 to-transparent rounded-full animate-rotate-slow"></div>
        
        {/* Moving Light Beams */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Floating Geometric Shapes */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 md:w-4 md:h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Matrix-style rain effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`rain-${i}`}
            className="absolute w-px h-16 bg-gradient-to-b from-cyan-400/60 to-transparent animate-slide-down"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" style={{animationDelay: '1.6s'}}></div>
        </div>
        
        {/* Holographic Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        
        {/* Energy Waves */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 md:w-64 md:h-64 border border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-32 h-32 md:w-64 md:h-64 border border-purple-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 w-32 h-32 md:w-64 md:h-64 border border-blue-400/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-block">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-4 md:mb-8 animate-fade-in">
              PROCESSUS RÉVOLUTIONNAIRE
            </h2>
            <div className="h-1 md:h-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full animate-glow"></div>
          </div>
          <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto mt-4 md:mt-8 animate-fade-in px-4" style={{animationDelay: '0.3s'}}>
            Votre site web haut de gamme livré en <span className="text-cyan-400 font-bold">4 jours minimum</span>
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Central Timeline - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50 animate-glow"></div>

          <div className="space-y-16 md:space-y-32">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 animate-fade-in group ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                style={{animationDelay: `${index * 0.4}s`}}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Content Card with Expandable Effect */}
                <div className="flex-1 relative w-full">
                  {/* Multiple layered glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl md:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse-glow"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-2xl md:rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse-glow" style={{animationDelay: '0.5s'}}></div>
                  
                  {/* Main Card Container */}
                  <div className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 group-hover:border-white/40 transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-4 shadow-2xl group-hover:shadow-cyan-500/20 overflow-hidden ${hoveredStep === index ? 'min-h-[600px]' : 'min-h-[200px]'}`}>
                    
                    {/* Enhanced Holographic Effects */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
                      {/* Particle System - More active on hover */}
                      {[...Array(hoveredStep === index ? 30 : 10)].map((_, i) => (
                        <div
                          key={`particle-${i}`}
                          className={`absolute w-1 h-1 bg-gradient-to-r ${step.gradient} rounded-full animate-float transition-opacity duration-500 ${hoveredStep === index ? 'opacity-80' : 'opacity-20'}`}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                          }}
                        />
                      ))}
                      
                      {/* Energy lines - Appear on hover */}
                      {hoveredStep === index && [...Array(8)].map((_, i) => (
                        <div
                          key={`line-${i}`}
                          className={`absolute h-px bg-gradient-to-r ${step.gradient} opacity-60 animate-pulse`}
                          style={{
                            left: `${i * 12}%`,
                            top: `${10 + i * 10}%`,
                            width: `${30 + Math.random() * 40}%`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}

                      {/* Scanning Effect on Hover */}
                      {hoveredStep === index && (
                        <div className="absolute inset-0">
                          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.gradient} animate-slide-down opacity-80`}></div>
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 p-6 md:p-10">
                      <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6">
                        <div className={`bg-gradient-to-r ${step.gradient} p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-0 md:mr-6 shadow-lg group-hover:shadow-2xl transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden`}>
                          {/* Icon glow effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700`}></div>
                          <div className="text-white relative z-10 group-hover:scale-110 transition-transform duration-500">
                            {step.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-3xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors duration-500">{step.title}</h3>
                          <div className={`inline-block px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r ${step.gradient} rounded-full text-white font-bold text-xs md:text-sm shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 animate-glow`}>
                            <Clock className="inline w-3 h-3 mr-1" />
                            {step.duration}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed group-hover:text-white transition-colors duration-500 mb-6">{step.description}</p>

                      {/* Expandable Content */}
                      <div className={`transition-all duration-700 overflow-hidden ${hoveredStep === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="border-t border-white/20 pt-6 space-y-6">
                          {/* Features Section */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                Fonctionnalités clés
                              </h4>
                              <ul className="space-y-2">
                                {step.expandedContent.features.map((feature, i) => (
                                  <li key={i} className="text-gray-300 text-sm flex items-start">
                                    <ArrowRight className="w-3 h-3 text-cyan-400 mr-2 mt-1 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                                Technologies utilisées
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {step.expandedContent.tools.map((tool, i) => (
                                  <span key={i} className={`px-3 py-1 bg-gradient-to-r ${step.gradient} rounded-full text-white text-xs font-semibold`}>
                                    {tool}
                                  </span>
                                ))}
                              </div>
                              
                              <h5 className="text-sm font-bold text-cyan-400 mb-2">Livrables</h5>
                              <p className="text-gray-300 text-sm">{step.expandedContent.deliverables}</p>
                            </div>
                          </div>

                          {/* Progress Indicator */}
                          <div className="flex items-center justify-between bg-black/30 rounded-lg p-4">
                            <span className="text-white font-semibold">Progression</span>
                            <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                              <div className={`h-2 bg-gradient-to-r ${step.gradient} rounded-full animate-pulse`} style={{width: `${(index + 1) * 25}%`}}></div>
                            </div>
                            <span className="text-cyan-400 font-bold">{(index + 1) * 25}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Corner Accents with animation */}
                    <div className={`absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br ${step.gradient} opacity-20 group-hover:opacity-60 rounded-bl-2xl md:rounded-bl-3xl rounded-tr-2xl md:rounded-tr-3xl transition-all duration-700 animate-pulse`}></div>
                    <div className={`absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-tr ${step.gradient} opacity-20 group-hover:opacity-60 rounded-tr-2xl md:rounded-tr-3xl rounded-bl-2xl md:rounded-bl-3xl transition-all duration-700 animate-pulse`} style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>

                {/* Enhanced Timeline Node - Only visible on md+ */}
                <div className="relative z-20 hidden md:block">
                  <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-black text-lg md:text-2xl shadow-2xl animate-bounce-slow border-4 border-white/20 group-hover:border-white/60 group-hover:scale-125 transition-all duration-700 relative overflow-hidden`}>
                    {/* Pulsing inner glow */}
                    <div className={`absolute inset-2 bg-gradient-to-r ${step.gradient} rounded-full animate-ping opacity-30`}></div>
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{index + 1}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  {/* Additional outer ring */}
                  <div className={`absolute -inset-2 border-2 border-gradient-to-r ${step.gradient} rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-500`}></div>
                </div>

                {/* Enhanced Mobile step number */}
                <div className="md:hidden relative z-20 order-first">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl border-2 border-white/20 group-hover:border-white/60 group-hover:scale-125 transition-all duration-700 animate-glow`}>
                    <span className="group-hover:scale-110 transition-transform duration-500">{index + 1}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-full animate-ping opacity-20`}></div>
                </div>

                {/* Spacer - Only on desktop */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mt-16 md:mt-24">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl md:rounded-3xl blur-xl animate-glow group-hover:blur-2xl transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-2xl md:rounded-3xl blur-2xl animate-glow group-hover:blur-3xl transition-all duration-700" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative bg-gradient-to-r from-purple-900/90 to-cyan-900/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl md:rounded-3xl border border-white/20 group-hover:border-white/40 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 shadow-2xl group-hover:shadow-cyan-500/30">
              
              {/* Background particles */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={`price-particle-${i}`}
                    className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 relative z-10">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-500">
                    À partir de 2000€
                  </div>
                  <div className="text-base md:text-lg text-gray-300 group-hover:text-cyan-200 transition-colors duration-500">Selon votre projet</div>
                </div>
                <div className="w-20 h-0.5 md:w-1 md:h-20 bg-gradient-to-r md:bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full animate-glow group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-500"></div>
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-500">
                    4 JOURS
                  </div>
                  <div className="text-base md:text-lg text-gray-300 group-hover:text-purple-200 transition-colors duration-500">Livraison minimum</div>
                </div>
              </div>
              <div className="mt-6 md:mt-8 text-gray-300 text-base md:text-lg group-hover:text-white transition-colors duration-500 relative z-10">
                Sans abonnement • Sans frais cachés • Hébergement premium inclus
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
