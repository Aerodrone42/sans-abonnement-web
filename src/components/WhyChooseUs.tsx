
import { Shield, Zap, Users, Award, Sparkles, Code2 } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Sans Abonnement",
      description: "Payez une fois, possédez à vie. Aucun frais mensuel caché ou surprise tarifaire.",
      gradient: "from-emerald-400 to-cyan-500",
      delay: "0s"
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Livraison Express",
      description: "Votre site professionnel livré en 4 jours maximum avec notre processus optimisé.",
      gradient: "from-purple-400 to-pink-500",
      delay: "0.2s"
    },
    {
      icon: <Code2 className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Technologies Avancées",
      description: "React, IA, optimisation SEO et design responsive pour une performance maximale.",
      gradient: "from-blue-400 to-cyan-500",
      delay: "0.4s"
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Support Premium",
      description: "Accompagnement personnalisé et formation complète pour votre autonomie totale.",
      gradient: "from-orange-400 to-red-500",
      delay: "0.6s"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          {/* Title with modern gradient effect */}
          <div className="relative inline-block mb-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 relative">
              <span className="relative">
                Pourquoi Nous Choisir ?
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-glow"></div>
                {/* Floating sparkles */}
                <Sparkles className="absolute -top-4 -right-8 w-6 h-6 text-purple-500 animate-bounce-slow" />
                <Award className="absolute -top-2 -left-8 w-5 h-5 text-cyan-500 animate-float" />
              </span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
              L'excellence technologique
            </span>
            {" "} rencontre le{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
              service premium
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in"
              style={{animationDelay: feature.delay}}
            >
              {/* Glow effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}></div>
              
              {/* Main card */}
              <div className="relative bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-white/50 hover:border-white/80 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 group">
                {/* Icon with gradient background */}
                <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-xl mb-6 inline-block shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:rotate-6 group-hover:scale-110`}>
                  <div className="text-white group-hover:animate-pulse">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Title with hover effect */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-500">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action with enhanced styling */}
        <div className="text-center mt-12 md:mt-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-900/90 to-cyan-900/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Prêt à Révolutionner Votre Présence en Ligne ?
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl">
                Rejoignez plus de 150 entreprises qui ont fait confiance à notre expertise
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 border-2 border-cyan-300/50 hover:border-cyan-200"
              >
                <Zap className="inline-block mr-2 w-5 h-5 animate-bounce" />
                Commencer Maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
