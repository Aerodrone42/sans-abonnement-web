
const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      business: "Boulangerie du Village",
      text: "Excellente prestation ! Mon site vitrine est exactement ce que je voulais. Fini les abonnements mensuels, je recommande vivement.",
      rating: 5,
      location: "Lyon"
    },
    {
      name: "Pierre Martin",
      business: "Plomberie Martin & Fils",
      text: "Site professionnel livré dans les délais, très bon référencement sur Google. Mes clients me trouvent plus facilement maintenant.",
      rating: 5,
      location: "Marseille"
    },
    {
      name: "Sophie Leroux",
      business: "Cabinet Kinésithérapie",
      text: "Création sur mesure parfaite pour mon activité. L'équipe est à l'écoute et très professionnelle. Aucun regret !",
      rating: 5,
      location: "Nantes"
    },
    {
      name: "Thomas Petit",
      business: "Garage Auto Expert",
      text: "Site internet pas cher et de qualité. Plus de frais mensuels à payer, c'est exactement ce qu'il me fallait pour mon garage.",
      rating: 5,
      location: "Toulouse"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avis de nos clients qui ont choisi notre solution sans abonnement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex justify-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t pt-4">
                <div className="font-semibold text-dark-blue">{testimonial.name}</div>
                <div className="text-primary text-sm font-medium">{testimonial.business}</div>
                <div className="text-gray-500 text-sm">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl inline-block">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">4.9/5</span>
              <div className="ml-4">
                <div className="flex">{renderStars(5)}</div>
                <p className="text-sm mt-1">Basé sur 150+ avis clients</p>
              </div>
            </div>
            <p className="text-lg">
              98% de nos clients recommandent nos services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
