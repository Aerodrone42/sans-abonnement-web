
import { Phone, Clock, Users, Heart, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCall = () => {
    window.location.href = 'tel:+33123456789';
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-dark-blue via-slate-900 to-dark-blue relative overflow-hidden">
      {/* Background effects with subtle elegance */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-turquoise rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Professional headline */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-turquoise text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              CONSULTATION GRATUITE
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Développez Votre Activité
            <br />
            <span className="bg-gradient-to-r from-turquoise to-accent bg-clip-text text-transparent">
              Avec un Site Web Professionnel
            </span>
          </h2>
          
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-turquoise/30 max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-slate-200 font-medium">
              Rejoignez les entrepreneurs qui ont choisi l'excellence pour <span className="text-turquoise font-semibold">faire grandir leur business</span>
            </p>
          </div>
        </div>

        {/* Benefits with positive messaging */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Users className="w-8 h-8" />,
              title: "Plus de clients qualifiés",
              benefit: "Attirez votre clientèle idéale",
              description: "Un site qui convertit les visiteurs en clients",
              gradient: "from-turquoise to-accent"
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Votre expertise valorisée",
              benefit: "Montrez votre savoir-faire",
              description: "Mettez en avant ce qui vous rend unique",
              gradient: "from-primary to-turquoise"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Croissance sécurisée",
              benefit: "Bâtissez sur du solide",
              description: "Une présence web qui grandit avec vous",
              gradient: "from-accent to-primary"
            }
          ].map((item, index) => (
            <div key={index} className="group text-center">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 transform group-hover:scale-105 transition-all duration-500">
                  <div className={`bg-gradient-to-r ${item.gradient} p-4 rounded-xl mb-6 inline-block text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-turquoise font-semibold mb-2">{item.benefit}</p>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA with professional approach */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-turquoise to-accent p-1 rounded-3xl max-w-4xl mx-auto">
            <div className="bg-dark-blue/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">
                <span className="text-turquoise">Parlons de Votre Projet</span> Ensemble
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="text-xl font-bold text-turquoise mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2" />
                    Notre accompagnement :
                  </h4>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="text-turquoise mr-3 font-bold">✓</span>
                      <span><strong>Consultation personnalisée</strong> gratuite</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-turquoise mr-3 font-bold">✓</span>
                      <span><strong>Analyse de vos besoins</strong> en détail</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-turquoise mr-3 font-bold">✓</span>
                      <span><strong>Proposition sur mesure</strong> adaptée</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-turquoise mr-3 font-bold">✓</span>
                      <span><strong>Accompagnement complet</strong> jusqu'au succès</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="text-xl font-bold text-accent mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    Les résultats que vous obtiendrez :
                  </h4>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="text-accent mr-3 font-bold">→</span>
                      <span>Plus de visibilité sur Google</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3 font-bold">→</span>
                      <span>Clients qui vous trouvent facilement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3 font-bold">→</span>
                      <span>Image professionnelle renforcée</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3 font-bold">→</span>
                      <span>Croissance durable de votre activité</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call buttons with warm approach */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-turquoise to-accent rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Button 
              onClick={handleCall}
              className="relative bg-gradient-to-r from-turquoise to-accent hover:from-turquoise/90 hover:to-accent/90 text-white px-10 py-8 rounded-2xl font-bold shadow-2xl transition-all duration-500 transform hover:scale-105 border-2 border-turquoise/30 hover:border-turquoise/50 text-xl"
            >
              <Phone className="mr-3 w-6 h-6" />
              ÉCHANGEONS MAINTENANT
              <div className="text-sm font-normal block">Consultation gratuite et sans engagement</div>
            </Button>
          </div>
          
          <div className="text-center">
            <div className="text-white font-semibold text-lg mb-2">OU</div>
            <Button 
              onClick={scrollToContact}
              variant="outline"
              className="bg-transparent border-2 border-turquoise/50 hover:border-turquoise text-turquoise hover:text-white hover:bg-turquoise/20 px-8 py-6 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 backdrop-blur-xl text-lg"
            >
              Planifier un rendez-vous
            </Button>
          </div>
        </div>

        {/* Social proof with positive tone */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-turquoise/20 max-w-2xl mx-auto">
            <div className="flex justify-center items-center mb-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-r from-turquoise to-accent rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="ml-4 text-left">
                <div className="text-turquoise font-bold text-lg">+50 entrepreneurs</div>
                <div className="text-white text-sm">nous font confiance</div>
              </div>
            </div>
            <p className="text-white font-medium">
              <span className="text-turquoise">✨</span>
              {" "}Rejoignez une communauté d'entrepreneurs qui réussissent
              {" "}<span className="text-turquoise">✨</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
