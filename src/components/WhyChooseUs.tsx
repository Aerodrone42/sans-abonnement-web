
import { Shield, Zap, Users, Award, Sparkles, Code2, Stars, Cpu, Globe, Rocket } from "lucide-react";

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
      title: "Livraison Express",
      description: "Votre site professionnel livré en 4 jours maximum avec notre processus optimisé.",
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
      description: "Accompagnement personnalisé et formation complète pour votre autonomie totale.",
      gradient: "from-orange-400 via-red-500 to-pink-600",
      delay: "0.6s",
      particles: "orange"
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
        {/* Premium Title Section */}
        <div className="text-center mb-16 md:mb-24">
          <div className="relative inline-block mb-8">
            {/* Quantum Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse scale-150"></div>
            
            <h2 className="relative text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-6">
              <span className="relative">
                Pourquoi Nous Choisir ?
                {/* Holographic Underline */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-60 animate-glow"></div>
                
                {/* Floating Tech Icons */}
                <Cpu className="absolute -top-8 -right-12 w-8 h-8 text-cyan-400 animate-spin-slow opacity-70" />
                <Globe className="absolute -top-6 -left-12 w-6 h-6 text-purple-400 animate-bounce-slow opacity-70" />
                <Rocket className="absolute -bottom-4 -right-8 w-5 h-5 text-pink-400 animate-float opacity-70" />
              </span>
            </h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-4">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                L'Excellence Technologique
              </span>
              {" "} rencontre le{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Service Premium
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 text-cyan-300/80">
              <Stars className="w-5 h-5 animate-pulse" />
              <span className="text-sm tracking-wider font-light">INNOVATION • PERFORMANCE • EXCELLENCE</span>
              <Stars className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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

        {/* Quantum CTA Section */}
        <div className="text-center mt-20 md:mt-32">
          <div className="relative inline-block">
            {/* Quantum Field */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse scale-110"></div>
            
            <div className="relative bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-2xl p-12 md:p-16 rounded-3xl border border-cyan-400/30 shadow-2xl">
              {/* Background Tech Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6,182,212,0.3) 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6">
                  Prêt à Révolutionner Votre Présence en Ligne ?
                </h3>
                
                <p className="text-gray-300 mb-8 max-w-3xl text-lg leading-relaxed">
                  Rejoignez l'élite des entreprises qui ont fait confiance à notre expertise technologique de pointe
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">150+ Projets Réalisés</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">Technologies Avancées</span>
                  </div>
                </div>
                
                <div className="relative group inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-glow"></div>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-12 py-6 rounded-2xl font-black shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 border-2 border-cyan-300/50 hover:border-cyan-200 text-xl"
                  >
                    <Rocket className="inline-block mr-3 w-6 h-6 animate-bounce" />
                    LANCER VOTRE PROJET
                    <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
