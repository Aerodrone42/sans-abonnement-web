
import { Gem, Flower2, Building2, Car, Plane, Shirt, Watch, Wine } from "lucide-react";

const Examples = () => {
  const categories = [
    {
      title: "Artisans de Luxe",
      examples: [
        {
          title: "Joaillerie sur mesure",
          description: "Créations uniques, pierres précieuses",
          icon: <Gem className="w-6 h-6" />,
          color: "from-amber-400 to-yellow-600"
        },
        {
          title: "Horlogerie d'exception",
          description: "Montres de prestige, complications",
          icon: <Watch className="w-6 h-6" />,
          color: "from-gray-400 to-gray-600"
        }
      ]
    },
    {
      title: "Services de Luxe",
      examples: [
        {
          title: "Spa & Wellness",
          description: "Soins haut de gamme, détente exclusive",
          icon: <Flower2 className="w-6 h-6" />,
          color: "from-emerald-400 to-teal-600"
        },
        {
          title: "Cabinet d'Architecture",
          description: "Design d'intérieur, projets sur mesure",
          icon: <Building2 className="w-6 h-6" />,
          color: "from-blue-400 to-indigo-600"
        }
      ]
    },
    {
      title: "Commerce de Prestige",
      examples: [
        {
          title: "Concessionnaire Premium",
          description: "Véhicules d'exception, service VIP",
          icon: <Car className="w-6 h-6" />,
          color: "from-red-400 to-red-600"
        },
        {
          title: "Boutique de Mode",
          description: "Créateurs, haute couture",
          icon: <Shirt className="w-6 h-6" />,
          color: "from-purple-400 to-pink-600"
        }
      ]
    },
    {
      title: "Expériences Exclusives",
      examples: [
        {
          title: "Aviation Privée",
          description: "Jets privés, voyages sur mesure",
          icon: <Plane className="w-6 h-6" />,
          color: "from-cyan-400 to-blue-600"
        },
        {
          title: "Cave à Vins d'Exception",
          description: "Grands crus, dégustations privées",
          icon: <Wine className="w-6 h-6" />,
          color: "from-red-500 to-purple-600"
        }
      ]
    }
  ];

  return (
    <section id="examples" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Clients Cibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous créons des sites web d'exception pour une clientèle exigeante qui recherche l'excellence et l'exclusivité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h3 className="text-xl font-bold text-dark-blue text-center mb-6 pb-2 border-b-2 border-primary">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${example.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                      {example.icon}
                    </div>
                    <h4 className="font-bold text-dark-blue mb-2">{example.title}</h4>
                    <p className="text-gray-600 text-sm">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Examples;
