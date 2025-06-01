
import { Check, Clock, User, Search, Cpu, Zap, Sparkles, Code2, Rocket } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Check className="w-10 h-10" />,
      title: "SANS ABONNEMENT",
      description: "Technologie révolutionnaire pour un paiement unique. Votre site évolue avec l'IA sans frais cachés ni dépendance.",
      color: "from-emerald-400 via-green-500 to-teal-600",
      glow: "group-hover:shadow-emerald-400/50",
      borderGlow: "group-hover:border-emerald-400/70"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "VITESSE EXTRÊME",
      description: "Architecture quantique optimisée par IA, CDN galactique, compression subatomique. Sites 500% plus rapides que l'impossible.",
      color: "from-yellow-400 via-orange-500 to-red-600",
      glow: "group-hover:shadow-yellow-400/50",
      borderGlow: "group-hover:border-yellow-400/70"
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: "IA SENTIENTE",
      description: "Intelligence artificielle auto-évolutive pour l'optimisation SEO transcendante, design adaptatif et amélioration perpétuelle.",
      color: "from-purple-400 via-violet-500 to-indigo-600",
      glow: "group-hover:shadow-purple-400/50",
      borderGlow: "group-hover:border-purple-400/70"
    },
    {
      icon: <Rocket className="w-10 h-10" />,
      title: "DESIGN CYBERPUNK",
      description: "Interface holographique multidimensionnelle. Microanimations 4D, effets quantiques et expérience utilisateur transcendante.",
      color: "from-cyan-400 via-blue-500 to-purple-600",
      glow: "group-hover:shadow-cyan-400/50",
      borderGlow: "group-hover:border-cyan-400/70"
    }
  ];

  return (
    <section id="services" className="py-40 bg-black relative overflow-hidden">
      {/* Holographic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.15),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.15),transparent_30%)] animate-pulse"></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-cyan-400/30 rotate-45 animate-rotate-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-purple-400/30 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-2 border-blue-400/30 rotate-12 animate-bounce-slow"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <div className="relative inline-block mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-black/50 backdrop-blur-xl border border-cyan-400/50 shadow-2xl shadow-cyan-500/25 animate-fade-in hover:scale-110 transition-all duration-500">
              <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                TECHNOLOGIE TRANSCENDANTE
              </span>
              <Sparkles className="w-7 h-7 text-purple-400 animate-bounce" />
            </div>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-white mb-12 animate-fade-in leading-none">
            <div className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
                POURQUOI CHOISIR
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white blur-lg opacity-40">
                POURQUOI CHOISIR
              </div>
            </div>
            <br />
            <div className="relative inline-block mt-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 animate-glow">
                LE FUTUR ?
              </span>
              <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 blur-xl opacity-60 animate-glow">
                LE FUTUR ?
              </div>
            </div>
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed animate-fade-in backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-cyan-400/30 shadow-2xl" style={{animationDelay: '0.3s'}}>
            Une révolution technologique qui transcende les limites conventionnelles pour créer des expériences digitales d'une dimension supérieure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-black/40 backdrop-blur-xl border border-cyan-400/30 ${feature.borderGlow} p-10 rounded-3xl transition-all duration-700 transform hover:-translate-y-8 hover:scale-110 hover:rotate-2 animate-fade-in ${feature.glow} hover:shadow-2xl`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Holographic Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-700 blur-xl`}></div>
              
              {/* Animated Icon Container */}
              <div className="relative mb-8">
                <div className={`relative bg-gradient-to-r ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-2xl`}>
                  {feature.icon}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-700`}></div>
                </div>
                {/* Floating particles around icon */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-500">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}></div>
              
              {/* Corner decorations */}
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-300 transition-colors duration-500"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-400/50 group-hover:border-purple-300 transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        {/* Ultra-Advanced CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-3xl"></div>
          <div className="relative bg-black/50 backdrop-blur-xl border border-cyan-400/50 p-16 rounded-3xl text-center overflow-hidden shadow-2xl shadow-cyan-500/25">
            {/* Animated background patterns */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl md:text-6xl font-black text-white mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-glow">
                  TRANSCENDEZ
                </span>{" "}
                <span className="text-white">
                  LA RÉALITÉ DIGITALE
                </span>
              </h3>
              
              <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
                Rejoignez l'élite technologique avec des sites web qui redéfinissent les lois de l'univers digital
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-lg mb-12">
                {[
                  '🤖 IA Quantique', 
                  '⚡ Vitesse Lumière', 
                  '🎨 Design 4D', 
                  '🛡️ Sécurité Absolue', 
                  '🌌 Multi-Dimension', 
                  '🔮 Futur-Ready'
                ].map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-cyan-400/40 px-6 py-3 rounded-full text-cyan-300 font-bold hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-lg hover:shadow-cyan-400/50"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Holographic CTA Button */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
                <button className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl px-12 py-6 rounded-2xl font-black shadow-2xl hover:scale-110 hover:rotate-1 transition-all duration-500 border-2 border-cyan-300/50 hover:border-cyan-200">
                  <Code2 className="inline mr-4 w-8 h-8 animate-bounce" />
                  ENTRER DANS LE FUTUR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
