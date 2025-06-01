
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Calendar, CreditCard, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-gradient-to-br from-primary via-dark-blue to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section - Responsive */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-2">
              Demandez votre devis gratuit
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4">
              Recevez votre proposition personnalisée sous 24h. Sans engagement, sans abonnement.
            </p>
          </div>

          {/* Main Content - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Formulaire - Mobile First */}
            <div className="w-full order-1 lg:order-1">
              <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl mx-2 sm:mx-0">
                <div className="flex items-center mb-4 md:mb-6">
                  <ContactIcon className="w-6 h-6 md:w-8 md:h-8 text-primary mr-2 md:mr-3 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-dark-blue">
                    Parlez-nous de votre projet
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Form Fields - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Nom complet *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full text-sm md:text-base"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full text-sm md:text-base"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Téléphone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full text-sm md:text-base"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Type d'activité *
                      </label>
                      <Input
                        type="text"
                        name="business"
                        value={formData.business}
                        onChange={handleChange}
                        required
                        className="w-full text-sm md:text-base"
                        placeholder="Artisan, Commerce, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Décrivez votre projet
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full text-sm md:text-base resize-none"
                      placeholder="Parlez-nous de votre activité, vos besoins, vos attentes..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Recevoir mon devis gratuit
                  </Button>

                  <p className="text-xs md:text-sm text-gray-500 text-center px-2">
                    * Champs obligatoires. Nous nous engageons à ne jamais revendre vos données.
                  </p>
                </form>
              </div>
            </div>

            {/* Informations de contact - Mobile Responsive */}
            <div className="w-full order-2 lg:order-2 space-y-6 md:space-y-8">
              {/* Contact direct */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white mx-2 sm:mx-0">
                <div className="flex items-center mb-3 md:mb-4">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-turquoise mr-2 md:mr-3 flex-shrink-0" />
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
