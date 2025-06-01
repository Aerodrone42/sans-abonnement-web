
import { Phone, Clock, AlertCircle, Heart, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCall = () => {
    window.location.href = 'tel:+33123456789';
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-red-900 via-red-800 to-orange-900 relative overflow-hidden">
      {/* Background effects with urgency */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Urgent headline */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-red-900 px-6 py-2 rounded-full font-black text-sm animate-bounce flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              DERNIÈRE CHANCE
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            <span className="text-yellow-400">STOP !</span> Vous Perdez des Clients
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Chaque Jour Sans Site Web
            </span>
          </h2>
          
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-yellow-400/30 max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-yellow-100 font-semibold">
              Pendant que vous hésitez, vos concurrents <span className="text-yellow-400 font-black">VOLENT VOS CLIENTS</span> sur Google
            </p>
          </div>
        </div>

        {/* Pain points with emotional triggers */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Temps qui s'échappe",
              pain: "Chaque jour = clients perdus",
              emotion: "La frustration de rater des opportunités",
              gradient: "from-red-500 to-red-600"
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Votre passion mérite mieux",
              pain: "Votre savoir-faire ignoré",
              emotion: "Vous méritez d'être reconnu",
              gradient: "from-orange-500 to-red-500"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Sécurisez votre avenir",
              pain: "Concurrence qui vous dépasse",
              emotion: "Protégez ce que vous avez bâti",
              gradient: "from-yellow-500 to-orange-500"
            }
          ].map((item, index) => (
            <div key={index} className="group text-center">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse`}></div>
                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 transform group-hover:scale-105 transition-all duration-500">
                  <div className={`bg-gradient-to-r ${item.gradient} p-4 rounded-xl mb-6 inline-block text-white animate-bounce-slow`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-red-200 font-semibold mb-2">{item.pain}</p>
                  <p className="text-yellow-200 text-sm italic">{item.emotion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA with urgency */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1 rounded-3xl max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-6">
                <span className="text-yellow-400">1 SEUL APPEL</span> Peut Tout Changer
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2 animate-pulse" />
                    Ce qui vous attend :
                  </h4>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3 font-bold">✓</span>
                      <span><strong>Analyse gratuite</strong> de votre situation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3 font-bold">✓</span>
                      <span><strong>Stratégie personnalisée</strong> en 15 minutes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3 font-bold">✓</span>
                      <span><strong>Devis immédiat</strong> sans surprise</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3 font-bold">✓</span>
                      <span><strong>Livraison en 4 jours</strong> maximum</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-2 animate-pulse" />
                    Si vous ne faites rien :
                  </h4>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3 font-bold">✗</span>
                      <span>Vos concurrents prennent vos clients</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3 font-bold">✗</span>
                      <span>Vous restez invisible sur Google</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3 font-bold">✗</span>
                      <span>Votre chiffre d'affaires stagne</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3 font-bold">✗</span>
                      <span>L'écart se creuse chaque jour</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call buttons with emotional triggers */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <Button 
              onClick={handleCall}
              className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-10 py-8 rounded-2xl font-black shadow-2xl transition-all duration-500 transform hover:scale-110 border-2 border-green-300/50 hover:border-green-200 text-xl"
            >
              <Phone className="mr-3 w-6 h-6 animate-bounce" />
              APPELEZ MAINTENANT
              <div className="text-sm font-normal block">Consultation gratuite immédiate</div>
            </Button>
          </div>
          
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-2">OU</div>
            <Button 
              onClick={scrollToContact}
              variant="outline"
              className="bg-transparent border-2 border-yellow-400/50 hover:border-yellow-300 text-yellow-200 hover:text-white hover:bg-yellow-500/20 px-8 py-6 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 backdrop-blur-xl text-lg"
            >
              Être rappelé sous 2h
            </Button>
          </div>
        </div>

        {/* Social proof with urgency */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-yellow-400/30 max-w-2xl mx-auto">
            <div className="flex justify-center items-center mb-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="ml-4 text-left">
                <div className="text-yellow-400 font-black text-lg">+50 entrepreneurs</div>
                <div className="text-white text-sm">nous ont appelés cette semaine</div>
              </div>
            </div>
            <p className="text-white font-semibold">
              <span className="text-red-400 animate-pulse">🔥</span>
              {" "}Ne laissez pas passer cette opportunité comme eux l'ont fait
              {" "}<span className="text-red-400 animate-pulse">🔥</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
