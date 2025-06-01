
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Calendar } from "lucide-react";
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
    <section id="contact" className="py-20 bg-gradient-to-br from-primary via-dark-blue to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Demandez votre devis gratuit
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Recevez votre proposition personnalisée sous 24h. Sans engagement, sans abonnement.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <ContactIcon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold text-dark-blue">
                  Parlez-nous de votre projet
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'activité *
                    </label>
                    <Input
                      type="text"
                      name="business"
                      value={formData.business}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Artisan, Commerce, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez votre projet
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full"
                    placeholder="Parlez-nous de votre activité, vos besoins, vos attentes..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Recevoir mon devis gratuit
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Champs obligatoires. Nous nous engageons à ne jamais revendre vos données.
                </p>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-turquoise mr-3" />
                  <h3 className="text-xl font-bold">Contact direct</h3>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Email :</span>
                    contact@siteinternetansabonnement.fr
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Téléphone :</span>
                    01 23 45 67 89
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Horaires :</span>
                    Lun-Ven 9h-18h
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-turquoise mr-3" />
                  <h3 className="text-xl font-bold">Réponse garantie</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-turquoise mr-2">✓</span>
                    Devis personnalisé sous 24h
                  </li>
                  <li className="flex items-start">
                    <span className="text-turquoise mr-2">✓</span>
                    Consultation gratuite et sans engagement
                  </li>
                  <li className="flex items-start">
                    <span className="text-turquoise mr-2">✓</span>
                    Conseils adaptés à votre activité
                  </li>
                  <li className="flex items-start">
                    <span className="text-turquoise mr-2">✓</span>
                    Pas de démarchage commercial
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">
                  🎯 Offre spéciale du moment
                </h3>
                <p className="text-lg mb-4">
                  <strong>-20% sur votre premier site</strong>
                </p>
                <p className="text-sm">
                  Valable pour toute commande avant fin du mois. 
                  Mentionnez le code "PREMIER20" dans votre message.
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
