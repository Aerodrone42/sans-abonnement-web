import { Shield, Zap, Users, Award, Sparkles, Code2, Stars, Cpu, Globe, Rocket, Eye, Target, TrendingUp, Layers } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Sans Abonnement",
      description: "Payez une fois, possédez à vie. Aucun frais mensuel caché ou surprise tarifaire.",
      gradient: "from-emerald-400 via-cyan-500 to-teal-600",
      delay: "0s",
      particles: "emerald"
    },
    {
      icon: <Zap className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Livraison Sur-Mesure",
      description: "Délai de livraison adapté à votre projet, minimum 4 jours avec un suivi personnalisé premium.",
      gradient: "from-purple-400 via-pink-500 to-rose-600",
      delay: "0.2s",
      particles: "purple"
    },
    {
      icon: <Code2 className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Technologies Avancées",
      description: "React, optimisation SEO et design responsive pour une performance maximale.",
      gradient: "from-blue-400 via-cyan-500 to-indigo-600",
      delay: "0.4s",
      particles: "blue"
    },
    {
      icon: <Users className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Support Premium",
      description: "Support technique du lundi au samedi de 8h à 19h avec accompagnement personnalisé.",
      gradient: "from-orange-400 via-red-500 to-pink-600",
      delay: "0.6s",
      particles: "orange"
    }
  ];

  const businessImpacts = [
    {
      icon: <Eye className="w-12 h-12" />,
      title: "Visibilité Maximale",
      description: "Multipliez votre présence en ligne par 10",
      metric: "+1000%",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      glow: "cyan"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Conversion Optimisée",
      description: "Transformez chaque visiteur en client potentiel",
      metric: "+350%",
      gradient: "from-purple-400 via-pink-500 to-rose-600",
      glow: "purple"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Croissance Exponentielle",
      description: "Accélérez votre développement commercial",
      metric: "+250%",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      glow: "emerald"
    },
    {
      icon: <Layers className="w-12 h-12" />,
      title: "Innovation Continue",
      description: "Restez à la pointe de la technologie",
      metric: "24/7",
      gradient: "from-amber-400 via-orange-500 to-red-600",
      glow: "amber"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Quantum Field Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(16,185,129,0.08),transparent_50%)] animate-pulse-glow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Revolutionary Business Impact Section */}
        <div className="text-center mb-32">
          <div className="relative inline-block mb-16">
            {/* Multi-layer Quantum Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse-glow scale-125" style={{animationDelay: '0.5s'}}></div>
            
            <h2 className="relative text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-8 leading-tight">
              <span className="relative block">
                Développez Votre Activité
                {/* Holographic Underline */}
                <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-60 animate-glow blur-sm"></div>
                
                {/* Floating Tech Icons */}
                <Cpu className="absolute -top-12 -right-16 w-10 h-10 text-cyan-400 animate-spin-slow opacity-70" />
                <Globe className="absolute -top-8 -left-16 w-8 h-8 text-purple-400 animate-bounce-slow opacity-70" />
              </span>
              <span className="relative block mt-4">
                Avec un Site Web 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                  {" "}Professionnel
                </span>
                <Rocket className="absolute -bottom-8 -right-12 w-8 h-8 text-pink-400 animate-float opacity-70" />
              </span>
            </h2>
          </div>
          
          {/* Revolutionary Impact Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {businessImpacts.map((impact, index) => (
              <div 
                key={index}
                className="group relative"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Holographic Field */}
                <div className={`absolute inset-0 bg-gradient-to-br ${impact.gradient} opacity-0 group-hover:opacity-40 rounded-3xl blur-3xl transition-all duration-1000 scale-110`}></div>
                
                {/* Quantum Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 p-[3px] group-hover:from-cyan-400/50 group-hover:via-purple-400/50 group-hover:to-pink-400/50 transition-all duration-700">
                  <div className="w-full h-full bg-black/90 backdrop-blur-xl rounded-3xl"></div>
                </div>
                
                {/* Main Content */}
                <div className="relative p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-6 group border border-white/20">
                  {/* Floating Energy Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1 h-1 bg-${impact.glow}-400 rounded-full animate-ping`}
                        style={{
                          left: `${15 + Math.random() * 70}%`,
                          top: `${15 + Math.random() * 70}%`,
                          animationDelay: `${Math.random() * 3}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Premium Icon with Holographic Effect */}
                  <div className="relative mb-8">
                    <div className={`bg-gradient-to-br ${impact.gradient} p-8 rounded-3xl shadow-2xl group-hover:shadow-${impact.glow}-500/40 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-125 relative overflow-hidden`}>
                      {/* Icon Holographic Shine */}
                      <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative text-white group-hover:animate-energy-pulse z-10">
                        {impact.icon}
                      </div>
                      
                      {/* Quantum Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[slide-in-right_1s_ease-out] transition-all duration-700"></div>
                    </div>
                    
                    {/* Orbital Rings */}
                    <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/40 rounded-3xl animate-spin-slow transition-all duration-1000"></div>
                    <div className="absolute inset-2 border border-purple-400/0 group-hover:border-purple-400/30 rounded-3xl animate-spin-slow transition-all duration-1000" style={{animationDirection: 'reverse'}}></div>
                  </div>
                  
                  {/* Impact Metrics */}
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${impact.gradient} mb-2 group-hover:animate-glow`}>
                      {impact.metric}
                    </div>
                    <div className="text-xs text-cyan-400 font-bold tracking-widest">IMPACT MESURÉ</div>
                  </div>
                  
                  {/* Typography with Advanced Effects */}
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-700">
                    {impact.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-500 mb-6">
                    {impact.description}
                  </p>

                  {/* Quantum Status Display */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-xs text-green-400 font-bold tracking-wider">OPTIMISÉ</span>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-1 h-6 bg-gradient-to-t ${impact.gradient} rounded-full opacity-80 group-hover:animate-pulse`} style={{animationDelay: `${i * 0.1}s`}}></div>
                      ))}
                    </div>
                  </div>

                  {/* Corner Quantum Indicators */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="w-4 h-4 border-t-3 border-r-3 border-cyan-400 animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                    <div className="w-4 h-4 border-b-3 border-l-3 border-purple-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Value Proposition */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            
            <div className="relative bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-2xl p-16 rounded-3xl border-2 border-cyan-400/30 shadow-2xl">
              {/* Quantum Tech Pattern Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 3px 3px, rgba(6,182,212,0.4) 2px, transparent 0)`,
                  backgroundSize: '50px 50px'
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-8 leading-tight">
                  Révolutionnez Votre Présence Digitale
                </h3>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-5xl leading-relaxed">
                  Transformez votre vision en{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    expérience digitale d'exception
                  </span>
                  {" "}grâce à nos technologies de pointe et notre expertise premium
                </p>
                
                {/* Advanced Metrics Display */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {[
                    { label: "Projets Premium", value: "150+", icon: <Award className="w-8 h-8" /> },
                    { label: "Technologies Next-Gen", value: "20+", icon: <Code2 className="w-8 h-8" /> },
                    { label: "Satisfaction Client", value: "99.8%", icon: <Stars className="w-8 h-8" /> }
                  ].map((stat, i) => (
                    <div key={i} className="group text-center">
                      <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl p-8 rounded-3xl border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-700 mb-4 transform group-hover:scale-110">
                        <div className="text-cyan-400 mb-4 flex justify-center group-hover:animate-bounce-slow">
                          {stat.icon}
                        </div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-400 font-medium tracking-wider">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Feature Cards - keep existing implementation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20">
          {features.map((feature, index) => (
            
            <div 
              key={index}
              className="group relative animate-fade-in"
              style={{animationDelay: feature.delay}}
            >
              {/* Quantum Field Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 rounded-3xl blur-2xl transition-all duration-700 scale-110`}></div>
              
              {/* Holographic Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-[2px] group-hover:from-cyan-400/40 group-hover:via-purple-400/40 group-hover:to-pink-400/40 transition-all duration-500">
                <div className="w-full h-full bg-black/80 backdrop-blur-xl rounded-3xl"></div>
              </div>
              
              {/* Main Card Content */}
              <div className="relative p-8 md:p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 group border border-white/10">
                {/* Floating Particles for each card */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 bg-${feature.particles}-400 rounded-full animate-ping`}
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Premium Icon Container */}
                <div className="relative mb-8">
                  <div className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-2xl shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-700 transform group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden`}>
                    {/* Icon Glow Effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-white group-hover:animate-pulse z-10">
                      {feature.icon}
                    </div>
                    
                    {/* Holographic shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[slide-in-right_0.6s_ease-out] transition-all duration-500"></div>
                  </div>
                  
                  {/* Quantum Orbit Ring */}
                  <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/30 rounded-2xl animate-spin-slow transition-all duration-700"></div>
                </div>
                
                {/* Premium Typography */}
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-500">
                  {feature.description}
                </p>

                {/* Tech Status Indicators */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">ACTIF</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-1 h-4 bg-gradient-to-t ${feature.gradient} rounded-full opacity-70`}></div>
                    ))}
                  </div>
                </div>

                {/* Corner Tech Details */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-400 animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="w-3 h-3 border-b-2 border-l-2 border-purple-400 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quantum CTA Section - Enhanced Version */}
        <div className="text-center mt-20 md:mt-32">
          <div className="relative inline-block">
            {/* Multi-layer Quantum Field */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-40 animate-pulse scale-120"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 rounded-3xl blur-2xl opacity-30 animate-pulse-glow scale-110" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-2xl p-16 md:p-20 rounded-3xl border-2 border-cyan-400/40 shadow-2xl">
              {/* Advanced Background Tech Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6,182,212,0.4) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-8 leading-tight">
                  Prêt à Révolutionner Votre Présence en Ligne ?
                </h3>
                
                <p className="text-gray-300 mb-12 max-w-4xl text-xl leading-relaxed">
                  Rejoignez l'élite des entreprises qui ont fait confiance à notre expertise technologique de pointe
                </p>
                
                <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Award className="w-6 h-6 animate-glow" />
                    <span className="text-lg font-bold">150+ Projets Réalisés</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full hidden md:block"></div>
                  <div className="flex items-center gap-3 text-purple-400">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <span className="text-lg font-bold">À partir de 2000€</span>
                  </div>
                </div>
                
                {/* Enhanced CTA Button */}
                <div className="relative group inline-block">
                  {/* Multi-layer Glow Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-glow scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 animate-pulse-glow scale-105"></div>
                  
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-16 py-8 rounded-3xl font-black shadow-2xl transition-all duration-700 transform hover:scale-110 hover:rotate-1 border-3 border-cyan-300/50 hover:border-cyan-200 text-xl md:text-2xl"
                  >
                    <Rocket className="inline-block mr-4 w-8 h-8 animate-bounce" />
                    LANCER VOTRE PROJET
                    
                    {/* Button Inner Glow */}
                    <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Quantum Particles on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 1}s`
                          }}
                        />
                      ))}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
