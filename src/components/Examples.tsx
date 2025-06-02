import { Gem, Flower2, Building2, Car, Plane, Shirt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Examples = () => {
  const examples = [
    {
      icon: Gem,
      title: "Bijouterie de Luxe",
      description: "Showcase élégant pour collections de bijoux haut de gamme",
      category: "Vitrine",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Flower2,
      title: "Caves à Vins Premium",
      description: "Plateforme de vente en ligne pour vins d'exception",
      category: "Boutique",
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: Building2,
      title: "Cabinet d'Architecture",
      description: "Portfolio moderne et interactif pour projets architecturaux",
      category: "Portfolio",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Car,
      title: "Concessionnaire Auto",
      description: "Plateforme de présentation et vente de véhicules de luxe",
      category: "Catalogue",
      color: "from-red-600 to-orange-600"
    },
    {
      icon: Plane,
      title: "Agence de Voyage",
      description: "Système de réservation et découverte de destinations",
      category: "Service",
      color: "from-cyan-600 to-blue-600"
    },
    {
      icon: Shirt,
      title: "Mode & Design",
      description: "Boutique en ligne pour créateurs de mode indépendants",
      category: "Créatif",
      color: "from-pink-600 to-rose-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Clients d'Excellence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez quelques-unes de nos réalisations pour des clients d'exception
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${example.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">{example.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {example.category}
                  </Badge>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {example.description}
                </p>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Examples;
