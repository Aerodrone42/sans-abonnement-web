
import { useState } from "react";
import { Monitor, Smartphone, Tablet, Globe, Star, Sparkles, Crown, Gem } from "lucide-react";

const Examples = () => {
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [hoveredExample, setHoveredExample] = useState<number | null>(null);

  const categories = [
    { id: "tous", label: "Tous les Sites", icon: <Globe className="w-4 h-4" /> },
    { id: "restaurant", label: "Restaurants", icon: <Sparkles className="w-4 h-4" /> },
    { id: "luxe", label: "Services de Luxe", icon: <Crown className="w-4 h-4" /> },
    { id: "portfolio", label: "Portfolio", icon: <Monitor className="w-4 h-4" /> }
  ];

  const examples = [
    {
      id: 1,
      title: "Restaurant Le Gourmet",
      category: "restaurant",
      description: "Site vitrine moderne avec système de réservation intégré",
      features: ["Réservations en ligne", "Menu interactif", "Galerie photos"],
      gradient: "from-orange-400 to-red-500",
      devices: ["desktop", "mobile"]
    },
    {
      id: 2,
      title: "Joaillerie de Prestige",
      category: "luxe",
      description: "Vitrine élégante pour créations haute joaillerie",
      features: ["Catalogue privé", "Sur-mesure", "Certificats"],
      gradient: "from-yellow-400 to-amber-500",
      devices: ["desktop", "mobile"]
    },
    {
      id: 3,
      title: "Photographe Pro",
      category: "portfolio",
      description: "Portfolio créatif avec galerie haute définition",
      features: ["Galerie HD", "Client privé", "Devis en ligne"],
      gradient: "from-emerald-400 to-teal-500",
      devices: ["desktop", "tablet"]
    },
    {
      id: 4,
      title: "Spa de Luxe",
      category: "luxe",
      description: "Expérience bien-être haut de gamme",
      features: ["Soins premium", "Réservation VIP", "Programmes sur-mesure"],
      gradient: "from-purple-400 to-pink-500",
      devices: ["desktop", "mobile"]
    },
    {
      id: 5,
      title: "Cabinet d'Architecture",
      category: "luxe",
      description: "Portfolio d'architecte pour projets de prestige",
      features: ["Projets exclusifs", "Visualisation 3D", "Consultation privée"],
      gradient: "from-slate-400 to-blue-500",
      devices: ["desktop", "tablet", "mobile"]
    },
    {
      id: 6,
      title: "Artisan Menuisier",
      category: "portfolio",
      description: "Showcase des créations avec galerie de projets",
      features: ["Galerie projets", "Témoignages", "Devis rapide"],
      gradient: "from-amber-400 to-orange-500",
      devices: ["desktop", "mobile"]
    }
  ];

  const filteredExamples = selectedCategory === "tous" 
    ? examples 
    : examples.filter(example => example.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block mb-6">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 relative">
              <span className="relative">
                Clients Cibles
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-glow"></div>
                <Globe className="absolute -top-4 -left-8 w-6 h-6 text-purple-500 opacity-60 animate-float" />
                <Sparkles className="absolute -top-2 -right-8 w-5 h-5 text-cyan-500 animate-bounce-slow" />
              </span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos créations récentes et imaginez votre{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
              futur site web
            </span>
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {filteredExamples.map((example, index) => (
            <div 
              key={example.id}
              className="group relative animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
              onMouseEnter={() => setHoveredExample(example.id)}
              onMouseLeave={() => setHoveredExample(null)}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}></div>
              
              {/* Main card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                
                {/* Device Preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-10`}></div>
                  
                  {/* Device Icons */}
                  <div className="relative z-10 flex items-center gap-4">
                    {example.devices.includes("desktop") && (
                      <Monitor className="w-12 h-12 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                    )}
                    {example.devices.includes("tablet") && (
                      <Tablet className="w-10 h-10 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
                    )}
                    {example.devices.includes("mobile") && (
                      <Smartphone className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                    )}
                  </div>

                  {/* Animated Elements */}
                  {hoveredExample === example.id && (
                    <>
                      <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute top-6 right-6 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-6 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-500">
                    {example.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {example.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {example.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`w-1.5 h-1.5 bg-gradient-to-r ${example.gradient} rounded-full`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-900/90 to-cyan-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Votre Projet Mérite le Même Niveau d'Excellence
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl">
                Chaque site est unique et créé sur mesure selon vos besoins spécifiques
              </p>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 border-2 border-cyan-300/50 hover:border-cyan-200"
              >
                <Star className="inline-block mr-2 w-5 h-5 animate-bounce" />
                Créer Mon Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Examples;
