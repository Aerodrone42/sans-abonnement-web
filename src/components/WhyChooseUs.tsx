
import { Check, Clock, User, Search, Cpu, Zap } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Check className="w-8 h-8" />,
      title: "Sans abonnement",
      description: "Technologie propriétaire pour un paiement unique. Votre site évolue avec les dernières innovations sans frais cachés.",
      color: "from-emerald-500 to-green-600",
      glow: "group-hover:shadow-emerald-500/25"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance ultra-rapide",
      description: "Architecture optimisée par IA, CDN mondial, compression automatique. Sites 300% plus rapides que la concurrence.",
      color: "from-yellow-500 to-orange-600",
      glow: "group-hover:shadow-yellow-500/25"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IA intégrée",
      description: "Intelligence artificielle pour l'optimisation SEO automatique, adaptation du design et amélioration continue.",
      color: "from-purple-500 to-violet-600",
      glow: "group-hover:shadow-purple-500/25"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Design futuriste",
      description: "Interface révolutionnaire adaptée à tous supports. Microanimations, effets 3D et expérience utilisateur immersive.",
      color: "from-cyan-500 to-blue-600",
      glow: "group-hover:shadow-cyan-500/25"
    }
  ];

  return (
    <section id="services" className="py-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 mb-8 animate-fade-in">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">TECHNOLOGIE AVANCÉE</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
              Pourquoi choisir
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              L'INNOVATION ?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
            Une approche révolutionnaire qui combine intelligence artificielle, performance extrême et design futuriste pour créer des sites web d'exception.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl hover:border-cyan-400/50 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 animate-fade-in ${feature.glow} hover:shadow-2xl`}
              style={{animationDelay: `${index * 0.15}s`}}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
              
              <div className={`relative bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Advanced CTA section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/20 p-12 rounded-3xl text-center relative overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  RÉVOLUTIONNEZ
                </span> votre présence digitale
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Rejoignez l'élite technologique avec des sites web qui redéfinissent les standards de l'industrie
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
                {['🚀 IA Intégrée', '⚡ Ultra-rapide', '🎨 Design 3D', '🔒 Sécurité maximale', '📱 Multi-plateforme'].map((tag, index) => (
                  <span key={index} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 px-4 py-2 rounded-full text-cyan-300 font-medium hover:scale-105 transition-transform duration-300">
                    {tag}
                  </span>
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
