
import { Contact, User, Calendar, Check } from "lucide-react";

const ProcessSteps = () => {
  const steps = [
    {
      icon: <Contact className="w-8 h-8" />,
      title: "Contact & Devis",
      description: "Vous nous contactez, nous analysons vos besoins et vous proposons un devis gratuit détaillé sous 24h.",
      duration: "1 jour"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Conception sur mesure",
      description: "Nous créons le design de votre site internet selon votre charte graphique et vos spécifications.",
      duration: "3-5 jours"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Développement",
      description: "Développement de votre site professionnel avec optimisation SEO et adaptation mobile incluses.",
      duration: "5-7 jours"
    },
    {
      icon: <Check className="w-8 h-8" />,
      title: "Livraison & Formation",
      description: "Mise en ligne de votre site et formation pour que vous puissiez le gérer en autonomie complète.",
      duration: "1 jour"
    }
  ];

  return (
    <section id="process" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Notre méthode en 4 étapes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processus simple et transparent pour la création de votre site internet professionnel
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent"></div>

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 animate-fade-in ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Content */}
                <div className="flex-1 lg:max-w-md">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                        <span className="text-accent font-medium">{step.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Step number */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                    {index + 1}
                  </div>
                  {/* Connector dots for large screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-0.5">
                      <div className="w-1 h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 lg:max-w-md hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-2xl text-white inline-block">
            <h3 className="text-2xl font-bold mb-2">
              Votre site internet prêt en 7 à 14 jours
            </h3>
            <p className="text-lg">
              Sans abonnement, sans engagement, avec hébergement inclus
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
