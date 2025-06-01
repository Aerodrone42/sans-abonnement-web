
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Pourquoi choisir un site sans abonnement ?",
      answer: "Avec notre solution, vous payez une seule fois et votre site vous appartient à vie. Pas de frais mensuels cachés, pas d'augmentation de tarifs surprise. Vous économisez des centaines d'euros par an comparé aux solutions avec abonnement."
    },
    {
      question: "Combien coûte la création de mon site internet ?",
      answer: "Nos tarifs commencent à partir de 897€ pour un site vitrine professionnel complet. Ce prix inclut la création, l'optimisation SEO, l'adaptation mobile et l'hébergement pour la première année. Demandez votre devis gratuit personnalisé."
    },
    {
      question: "Mon site sera-t-il optimisé pour Google ?",
      answer: "Absolument ! Tous nos sites sont créés avec les meilleures pratiques SEO : structure optimisée, balises meta, sitemap, temps de chargement rapide, compatibilité mobile. Votre site sera visible sur Google et attirera vos futurs clients."
    },
    {
      question: "Puis-je modifier mon site après sa création ?",
      answer: "Oui, nous vous formons à la gestion de votre site. Vous pourrez modifier les textes, ajouter des photos, créer de nouvelles pages. Pour les modifications plus complexes, nous proposons un service de maintenance à la demande."
    },
    {
      question: "Qu'est-ce qui est inclus dans le prix ?",
      answer: "Le prix inclut : conception graphique personnalisée, développement complet, optimisation SEO, adaptation mobile et tablette, hébergement sécurisé, nom de domaine, formation à la gestion et support technique."
    },
    {
      question: "Combien de temps pour créer mon site ?",
      answer: "La création de votre site internet prend entre 7 et 14 jours ouvrés selon la complexité. Nous respectons toujours nos délais et vous tenons informé de l'avancement à chaque étape."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur la création de site internet sans abonnement
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-dark-blue pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-8 pb-6 animate-accordion-down">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Vous avez d'autres questions ?
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105"
            >
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
