
import { Sparkles, Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      business: "Boulangerie du Village",
      text: "Excellente prestation ! Mon site vitrine est exactement ce que je voulais. Fini les abonnements mensuels, je recommande vivement.",
      rating: 5,
      location: "Lyon",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      name: "Pierre Martin",
      business: "Plomberie Martin & Fils",
      text: "Site professionnel livré dans les délais, très bon référencement sur Google. Mes clients me trouvent plus facilement maintenant.",
      rating: 5,
      location: "Marseille",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      name: "Sophie Leroux",
      business: "Cabinet Kinésithérapie",
      text: "Création sur mesure parfaite pour mon activité. L'équipe est à l'écoute et très professionnelle. Aucun regret !",
      rating: 5,
      location: "Nantes",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      name: "Thomas Petit",
      business: "Garage Auto Expert",
      text: "Site internet pas cher et de qualité. Plus de frais mensuels à payer, c'est exactement ce qu'il me fallait pour mon garage.",
      rating: 5,
      location: "Toulouse",
      gradient: "from-green-400 to-emerald-500"
    }
  ];

  const renderStars = (rating: number, gradient: string) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? `text-yellow-400 fill-yellow-400` : 'text-gray-300'} transition-all duration-300 hover:scale-125`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-200 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          {/* Enhanced title */}
          <div className="relative inline-block mb-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 relative">
              <span className="relative">
                Témoignages Clients
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-glow"></div>
                {/* Floating quote icon */}
                <Quote className="absolute -top-6 -left-8 w-8 h-8 text-purple-500 opacity-30 animate-float" />
                <Sparkles className="absolute -top-4 -right-8 w-6 h-6 text-cyan-500 animate-bounce-slow" />
              </span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avis de nos clients qui ont choisi notre 
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
              {" "}solution sans abonnement
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}></div>
              
              {/* Main card */}
              <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-white/50 hover:border-white/80 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3">
                {/* Quote decoration */}
                <div className="absolute top-4 right-4">
                  <Quote className={`w-8 h-8 text-gradient bg-gradient-to-r ${testimonial.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                </div>
                
                {/* Stars rating */}
                <div className="flex justify-center mb-4 space-x-1">
                  {renderStars(testimonial.rating, testimonial.gradient)}
                </div>
                
                {/* Testimonial text */}
                <p className="text-gray-600 mb-6 italic leading-relaxed relative">
                  <span className="text-4xl text-gray-300 absolute -top-2 -left-2">"</span>
                  <span className="relative z-10">{testimonial.text}</span>
                  <span className="text-4xl text-gray-300 absolute -bottom-6 -right-2">"</span>
                </p>
                
                {/* Client info */}
                <div className="border-t border-gray-200 pt-4 group-hover:border-gray-300 transition-colors duration-300">
                  <div className="font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-500">
                    {testimonial.name}
                  </div>
                  <div className={`text-sm font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent mb-1`}>
                    {testimonial.business}
                  </div>
                  <div className="text-gray-500 text-sm flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    {testimonial.location}
                  </div>
                </div>

                {/* Hover decoration */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced stats section */}
        <div className="text-center mt-12 md:mt-16">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 transform hover:scale-105 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2 animate-bounce-slow">
                    4.9/5
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(5, "from-yellow-400 to-orange-500")}
                  </div>
                  <p className="text-green-100 text-sm">Note moyenne</p>
                </div>
                <div className="w-16 h-0.5 md:w-1 md:h-16 bg-gradient-to-r md:bg-gradient-to-b from-white/50 to-white/20 rounded-full"></div>
                <div className="text-center">
                  <p className="text-lg md:text-xl text-white font-semibold">
                    98% de nos clients recommandent nos services
                  </p>
                  <p className="text-green-100 text-sm mt-2">
                    Basé sur 150+ avis clients vérifiés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
