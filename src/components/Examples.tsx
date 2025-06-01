
import { Gem, Flower2, Building2, Car, Plane, Shirt, Watch, Wine, Zap, Globe, Shield, Sparkles } from "lucide-react";
import { useState } from "react";

const Examples = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const categories = [
    {
      title: "Artisans de Luxe",
      subtitle: "Excellence & Savoir-faire",
      examples: [
        {
          title: "Joaillerie sur mesure",
          description: "Créations uniques, pierres précieuses d'exception",
          icon: <Gem className="w-8 h-8" />,
          gradient: "from-amber-300 via-yellow-400 to-amber-600",
          bgPattern: "holographic-gold",
          metrics: "50K€+ / création"
        },
        {
          title: "Horlogerie d'exception",
          description: "Montres de prestige, complications horlogères",
          icon: <Watch className="w-8 h-8" />,
          gradient: "from-slate-300 via-gray-400 to-slate-600",
          bgPattern: "metallic-silver",
          metrics: "25K€+ / pièce"
        }
      ]
    },
    {
      title: "Services de Prestige",
      subtitle: "Innovation & Exclusivité",
      examples: [
        {
          title: "Spa & Wellness Premium",
          description: "Protocoles révolutionnaires, technologies avancées",
          icon: <Flower2 className="w-8 h-8" />,
          gradient: "from-emerald-300 via-teal-400 to-cyan-600",
          bgPattern: "quantum-emerald",
          metrics: "500€+ / séance"
        },
        {
          title: "Architecture d'Avant-garde",
          description: "Design futuriste, matériaux intelligents",
          icon: <Building2 className="w-8 h-8" />,
          gradient: "from-blue-300 via-indigo-400 to-purple-600",
          bgPattern: "neural-blue",
          metrics: "2M€+ / projet"
        }
      ]
    },
    {
      title: "Commerce d'Exception",
      subtitle: "Luxe & Performance",
      examples: [
        {
          title: "Hypercars & Supercars",
          description: "Véhicules d'exception, technologies hybrides",
          icon: <Car className="w-8 h-8" />,
          gradient: "from-red-300 via-rose-400 to-red-600",
          bgPattern: "carbon-fiber",
          metrics: "200K€+ / véhicule"
        },
        {
          title: "Haute Couture Tech",
          description: "Créateurs visionnaires, textiles intelligents",
          icon: <Shirt className="w-8 h-8" />,
          gradient: "from-purple-300 via-pink-400 to-rose-600",
          bgPattern: "silk-weave",
          metrics: "15K€+ / création"
        }
      ]
    },
    {
      title: "Expériences Ultimes",
      subtitle: "Technologie & Émotion",
      examples: [
        {
          title: "Aerospace Privé",
          description: "Vols suborbitaux, technologies spatiales",
          icon: <Plane className="w-8 h-8" />,
          gradient: "from-cyan-300 via-blue-400 to-indigo-600",
          bgPattern: "stellar-field",
          metrics: "500K€+ / vol"
        },
        {
          title: "Œnologie Quantique",
          description: "Caves climatisées IA, dégustations immersives",
          icon: <Wine className="w-8 h-8" />,
          gradient: "from-red-400 via-purple-500 to-violet-600",
          bgPattern: "vintage-crystal",
          metrics: "100K€+ / cave"
        }
      ]
    }
  ];

  return (
    <section id="examples" className="relative py-32 bg-gradient-to-b from-dark-blue via-slate-900 to-dark-blue overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Quantum Particles */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-turquoise rounded-full animate-pulse-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Neural Network Lines */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            {[...Array(20)].map((_, i) => (
              <line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Holographic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/5 via-transparent to-accent/5 animate-pulse-glow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Futuristic Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-turquoise/20 to-accent/20 backdrop-blur-xl px-8 py-3 rounded-full border border-turquoise/30 mb-8">
            <Globe className="w-6 h-6 text-turquoise mr-3 animate-spin-slow" />
            <span className="text-turquoise font-bold tracking-wider">ÉCOSYSTÈME PREMIUM</span>
            <Sparkles className="w-6 h-6 text-accent ml-3 animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-turquoise to-accent bg-clip-text text-transparent">
              Clients d'Excellence
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-normal text-slate-300">
              Technologies Révolutionnaires
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Nous concevons des expériences digitales d'exception pour une clientèle 
              <span className="text-turquoise font-semibold"> ultra-premium </span>
              qui redéfinit les standards de l'innovation
            </p>
          </div>

          {/* Tech Indicators */}
          <div className="flex justify-center space-x-8 mb-12">
            {[
              { label: "Chiffre d'Affaires", value: "10M€+", icon: <Shield /> },
              { label: "Technologies", value: "Next-Gen", icon: <Zap /> },
              { label: "ROI Moyen", value: "250%", icon: <Sparkles /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="bg-gradient-to-r from-turquoise/20 to-accent/20 backdrop-blur-xl p-4 rounded-2xl border border-turquoise/20 group-hover:border-turquoise/50 transition-all duration-500 mb-3">
                  <div className="text-turquoise">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Luxury Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              {/* Category Header */}
              <div className="text-center relative">
                <div className="bg-gradient-to-r from-turquoise/10 via-accent/10 to-turquoise/10 backdrop-blur-xl p-6 rounded-3xl border border-turquoise/20">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-turquoise font-semibold text-sm tracking-wider">{category.subtitle}</p>
                </div>
              </div>
              
              {/* Premium Cards */}
              <div className="space-y-6">
                {category.examples.map((example, index) => {
                  const cardIndex = categoryIndex * 10 + index;
                  return (
                    <div
                      key={index}
                      className="group relative"
                      onMouseEnter={() => setHoveredCard(cardIndex)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Holographic Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-turquoise/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl blur-xl transform scale-110"></div>
                      
                      {/* Main Card */}
                      <div className="relative bg-gradient-to-br from-slate-900/80 via-dark-blue/90 to-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-turquoise/20 group-hover:border-turquoise/60 transition-all duration-700 transform group-hover:scale-105 group-hover:-translate-y-2">
                        
                        {/* Animated Icon Container */}
                        <div className="relative mb-6">
                          <div className={`absolute inset-0 bg-gradient-to-r ${example.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transition-all duration-700 animate-pulse-glow`}></div>
                          <div className={`relative bg-gradient-to-r ${example.gradient} p-5 rounded-2xl text-white group-hover:scale-110 transition-all duration-500`}>
                            {example.icon}
                          </div>
                          
                          {/* Premium Badge */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-dark-blue text-xs font-bold px-3 py-1 rounded-full animate-glow">
                            PREMIUM
                          </div>
                        </div>

                        {/* Content */}
                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-turquoise transition-colors duration-300">
                          {example.title}
                        </h4>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                          {example.description}
                        </p>
                        
                        {/* Metrics */}
                        <div className="flex items-center justify-between">
                          <div className="text-turquoise font-bold text-lg">
                            {example.metrics}
                          </div>
                          <div className="text-accent text-sm font-semibold">
                            ULTRA-LUXE
                          </div>
                        </div>

                        {/* Hover Effect Particles */}
                        {hoveredCard === cardIndex && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-turquoise rounded-full animate-bounce-slow"
                                style={{
                                  left: `${20 + Math.random() * 60}%`,
                                  top: `${20 + Math.random() * 60}%`,
                                  animationDelay: `${i * 0.1}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-turquoise/10 via-accent/10 to-turquoise/10 backdrop-blur-2xl p-12 rounded-3xl border border-turquoise/30 max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="text-turquoise">Votre Vision</span> × <span className="text-accent">Notre Expertise</span>
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Ensemble, créons une présence digitale qui reflète l'excellence et l'innovation 
              de votre marque dans l'écosystème du luxe technologique
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-turquoise to-accent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                <button className="relative bg-gradient-to-r from-turquoise to-accent text-white px-12 py-6 rounded-2xl font-bold text-lg transform group-hover:scale-105 transition-all duration-300 border-2 border-turquoise/30 group-hover:border-turquoise/60">
                  <Zap className="inline-block w-6 h-6 mr-3" />
                  CRÉONS L'EXCEPTION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Examples;
