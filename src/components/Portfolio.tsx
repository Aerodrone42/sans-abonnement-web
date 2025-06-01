
import { useState } from "react";

const Portfolio = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const projects = [
    {
      title: "Restaurant Le Gourmet",
      category: "Restauration",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center",
      description: "Site vitrine avec menu en ligne et réservations"
    },
    {
      title: "Plomberie Martin",
      category: "Artisan",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      description: "Site professionnel avec zone d'intervention"
    },
    {
      title: "Boutique Mode & Style",
      category: "Commerce",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
      description: "Site e-commerce élégant et moderne"
    },
    {
      title: "Cabinet Avocat Durand",
      category: "Profession libérale",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&crop=center",
      description: "Site institutionnel avec prise de rendez-vous"
    },
    {
      title: "Garage Auto Plus",
      category: "Automobile",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=center",
      description: "Site avec devis en ligne et présentation services"
    },
    {
      title: "Institut Beauté Zen",
      category: "Bien-être",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&crop=center",
      description: "Site spa avec réservation en ligne"
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6">
            Nos dernières réalisations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez quelques sites internet que nous avons créés pour nos clients, sans abonnement ni engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className={`absolute inset-0 bg-gradient-to-t from-dark-blue/90 via-dark-blue/50 to-transparent transition-opacity duration-300 ${hoveredItem === index ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="inline-block bg-accent px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-200 text-sm">{project.description}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-primary text-sm font-medium">{project.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Votre projet mérite une création sur mesure
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105"
          >
            Commencer mon projet
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
