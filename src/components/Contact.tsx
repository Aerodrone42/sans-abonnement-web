
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Calendar, CreditCard, Eye, Zap, Shield, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi avec effet de loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Données du formulaire:", formData);
    
    toast({
      title: "Demande envoyée !",
      description: "Nous vous répondrons dans les 24h avec votre devis gratuit.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      business: "",
      message: ""
    });
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="relative py-12 md:py-20 bg-gradient-to-br from-primary via-dark-blue to-accent overflow-hidden">
      {/* Fond technologique animé */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grille futuriste */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse-glow"></div>
        
        {/* Particules flottantes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-turquoise rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Faisceaux lumineux diagonaux */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-turquoise to-transparent opacity-30 transform rotate-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-20 transform -rotate-12 animate-pulse"></div>
        
        {/* Orbes d'énergie */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-turquoise rounded-full opacity-10 blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full opacity-10 blur-3xl animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-turquoise/30">
              <Cpu className="w-6 h-6 text-turquoise mr-2" />
              <span className="text-white font-medium">Interface Technologique Avancée</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-2">
              Demandez votre devis gratuit
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">
              Système de contact intelligent • Réponse automatisée sous 24h • Technologie de pointe
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Formulaire modernisé */}
            <div className="w-full order-1 lg:order-1">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl mx-2 sm:mx-0 overflow-hidden">
                {/* Effet de scan */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-turquoise/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-[slide-in-right_3s_ease-in-out_infinite]"></div>
                
                {/* Coins technologiques */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-turquoise"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-turquoise"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-turquoise"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-turquoise"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="relative">
                      <ContactIcon className="w-6 h-6 md:w-8 md:h-8 text-turquoise mr-2 md:mr-3 flex-shrink-0" />
                      <div className="absolute inset-0 bg-turquoise/20 rounded-full blur-sm animate-pulse"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      Interface de Communication Avancée
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-200 mb-1 md:mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-turquoise" />
                          Nom complet *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-turquoise focus:ring-turquoise backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
                          placeholder="Votre nom"
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-turquoise/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-200 mb-1 md:mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-turquoise" />
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-turquoise focus:ring-turquoise backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
                          placeholder="votre@email.com"
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-turquoise/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-200 mb-1 md:mb-2">
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-turquoise focus:ring-turquoise backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
                          placeholder="06 12 34 56 78"
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-turquoise/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-200 mb-1 md:mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-turquoise" />
                          Type d'activité *
                        </label>
                        <Input
                          type="text"
                          name="business"
                          value={formData.business}
                          onChange={handleChange}
                          required
                          className="w-full text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-turquoise focus:ring-turquoise backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
                          placeholder="Artisan, Commerce, etc."
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-turquoise/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-200 mb-1 md:mb-2">
                        Décrivez votre projet
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full text-sm md:text-base resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-turquoise focus:ring-turquoise backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20"
                        placeholder="Parlez-nous de votre activité, vos besoins, vos attentes..."
                      />
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-turquoise/20 to-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-turquoise to-primary hover:from-primary hover:to-turquoise text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg md:rounded-xl transition-all duration-500 transform hover:scale-105 group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Traitement en cours...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10">Recevoir mon devis gratuit</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </>
                      )}
                    </Button>

                    <p className="text-xs md:text-sm text-gray-300 text-center px-2">
                      🔒 Champs obligatoires. Données sécurisées et jamais revendues.
                    </p>
                  </form>
                </div>
              </div>
            </div>

            {/* Informations de contact modernisées */}
            <div className="w-full order-2 lg:order-2 space-y-6 md:space-y-8">
              {/* Contact direct */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white mx-2 sm:mx-0 border border-white/20 overflow-hidden group hover:bg-white/10 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-turquoise to-primary"></div>
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="relative">
                    <Mail className="w-6 h-6 md:w-8 md:h-8 text-turquoise mr-2 md:mr-3 flex-shrink-0" />
                    <div className="absolute inset-0 bg-turquoise/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Contact direct</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <p className="flex flex-col sm:flex-row sm:items-center text-sm md:text-base">
                    <span className="font-medium mr-0 sm:mr-2">Email :</span>
                    <span className="break-all">aerodrone.multiservices@gmail.com</span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center text-sm md:text-base">
                    <span className="font-medium mr-0 sm:mr-2">Téléphone :</span>
                    <span>06 14 17 38 67</span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center text-sm md:text-base">
                    <span className="font-medium mr-0 sm:mr-2">Horaires :</span>
                    <span>Lun-Ven 9h-18h</span>
                  </p>
                </div>
              </div>

              {/* Paiement et suivi */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white mx-2 sm:mx-0">
                <div className="flex items-center mb-3 md:mb-4">
                  <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-turquoise mr-2 md:mr-3 flex-shrink-0" />
                  <h3 className="text-lg md:text-xl font-bold">Paiement & Suivi</h3>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">💳</span>
                    <span><strong>Paiement à la livraison</strong> - Aucun frais à l'avance</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">👀</span>
                    <span><strong>Suivi en temps réel</strong> de l'avancement de votre site</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">✅</span>
                    <span>Validation à chaque étape du développement</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">🔒</span>
                    <span>Sécurité garantie - Paiement uniquement après satisfaction</span>
                  </li>
                </ul>
              </div>

              {/* Réponse garantie */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white mx-2 sm:mx-0">
                <div className="flex items-center mb-3 md:mb-4">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8 text-turquoise mr-2 md:mr-3 flex-shrink-0" />
                  <h3 className="text-lg md:text-xl font-bold">Réponse garantie</h3>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">✓</span>
                    <span>Devis personnalisé sous 24h</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">✓</span>
                    <span>Consultation gratuite et sans engagement</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">✓</span>
                    <span>Conseils adaptés à votre activité</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base">
                    <span className="text-turquoise mr-2 flex-shrink-0">✓</span>
                    <span>Pas de démarchage commercial</span>
                  </li>
                </ul>
              </div>

              {/* Offre spéciale */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white mx-2 sm:mx-0">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                  🎯 Offre spéciale du moment
                </h3>
                <p className="text-base md:text-lg mb-3 md:mb-4">
                  <strong>-50% sur votre premier site</strong>
                </p>
                <p className="text-xs md:text-sm leading-relaxed">
                  Valable pour toute commande avant fin du mois. 
                  Mentionnez le code "PREMIER50" dans votre message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
