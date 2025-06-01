
import { Check, Clock, User, Search } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Check className="w-8 h-8" />,
      title: "Pas d'abonnement mensuel",
      description: "Paiement en une fois, votre site vous appartient à vie. Fini les frais récurrents qui plombent votre budget.",
      color: "bg-green-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Livraison rapide",
      description: "Votre site vitrine professionnel est créé et mis en ligne en 7 à 14 jours maximum. Efficacité garantie.",
      color: "bg-primary"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Optimisé pour Google",
      description: "Site web optimisé SEO pour être visible sur Google et attirer vos futurs clients naturellement.",
      color: "bg-accent"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Personnalisation totale",
      description: "Site internet sur mesure qui reflète parfaitement votre activité et votre image de marque.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une approche transparente et sans surprise pour votre création de site internet professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-dark-blue mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Spécialement conçu pour les professionnels
          </h3>
          <p className="text-lg mb-6">
            Artisans, commerçants, indépendants, TPE/PME : nous créons votre site vitrine professionnel sans engagement ni abonnement
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">Auto-entrepreneurs</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Artisans</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Commerçants</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Professions libérales</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
