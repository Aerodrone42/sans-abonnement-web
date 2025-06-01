import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Pourquoi choisir un site sans abonnement ?",
      answer: "Avec notre solution, vous payez une seule fois et votre site vous appartient à vie. Pas de frais mensuels cachés, pas d'augmentation de tarifs surprise. Vous économisez des milliers d'euros par an comparé aux solutions avec abonnement.",
      gradient: "from-emerald-400 to-cyan-500"
    },
    {
      question: "À partir de combien commence la création de mon site internet haut de gamme ?",
      answer: "Nos sites web de luxe entièrement personnalisés commencent à partir de 2000€. Ce prix de base inclut la création sur-mesure, l'optimisation SEO avancée, l'adaptation mobile premium et l'hébergement haute performance. Le coût final dépend de vos besoins spécifiques. Demandez votre devis gratuit personnalisé.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      question: "Mon site sera-t-il optimisé pour Google ?",
      answer: "Absolument ! Tous nos sites sont créés avec les meilleures pratiques SEO : structure optimisée, balises meta avancées, sitemap, temps de chargement ultra-rapide, compatibilité mobile parfaite. Votre site sera visible sur Google et attirera vos futurs clients.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      question: "Puis-je modifier mon site après sa création ?",
      answer: "Oui, nous vous formons à la gestion de votre site premium. Vous pourrez modifier les textes, ajouter des photos, créer de nouvelles pages. Pour les modifications plus complexes, nous proposons un service de maintenance haut de gamme à la demande.",
      gradient: "from-orange-400 to-red-500"
    },
    {
      question: "Qu'est-ce qui est inclus dans le prix de base ?",
      answer: "Le prix de base inclut : conception graphique sur-mesure exclusive, développement complet avec technologies avancées, optimisation SEO premium, adaptation mobile et tablette parfaite, hébergement sécurisé haute performance, nom de domaine, formation personnalisée et support technique VIP.",
      gradient: "from-violet-400 to-purple-500"
    },
    {
      question: "Combien de temps pour créer mon site de luxe ?",
      answer: "La création de votre site internet haut de gamme prend minimum 4 jours et varie selon la complexité et vos exigences premium. Nous respectons toujours nos délais convenus et vous tenons informé de l'avancement à chaque étape.",
      gradient: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            {/* Enhanced title */}
            <div className="relative inline-block mb-6">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 relative">
                <span className="relative">
                  Questions Fréquentes
                  {/* Animated underline */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-glow"></div>
                  {/* Floating icons */}
                  <HelpCircle className="absolute -top-6 -left-8 w-8 h-8 text-purple-500 opacity-30 animate-float" />
                  <Sparkles className="absolute -top-4 -right-8 w-6 h-6 text-cyan-500 animate-bounce-slow" />
                </span>
              </h2>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600">
              Tout ce que vous devez savoir sur la création de site internet
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                {" "}haut de gamme
              </span>
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group relative animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${faq.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-all duration-500`}></div>
                
                {/* Main card */}
                <div className="relative bg-gray-50/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 transform hover:scale-[1.02]">
                  <button
                    className="w-full px-6 md:px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100/50 transition-all duration-300"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-500">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 transition-all duration-300 transform ${openIndex === index ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`}>
                      {openIndex === index ? (
                        <ChevronUp className={`w-6 h-6 bg-gradient-to-r ${faq.gradient} bg-clip-text text-transparent`} />
                      ) : (
                        <ChevronDown className={`w-6 h-6 bg-gradient-to-r ${faq.gradient} bg-clip-text text-transparent`} />
                      )}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 md:px-8 pb-6 animate-accordion-down">
                      <div className="relative">
                        {/* Answer content */}
                        <p className="text-gray-600 leading-relaxed relative z-10">
                          {faq.answer}
                        </p>
                        
                        {/* Decorative gradient bar */}
                        <div className={`w-12 h-1 bg-gradient-to-r ${faq.gradient} rounded-full mt-4 opacity-60`}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6 text-lg">
              Vous avez d'autres questions ?
            </p>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur-lg opacity-60 animate-pulse"></div>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-1 border-2 border-purple-300/50 hover:border-purple-200"
              >
                <HelpCircle className="inline-block mr-2 w-5 h-5 animate-bounce" />
                Contactez-nous
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
