
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Phone, Building, Send } from "lucide-react";
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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Données du formulaire:", formData);
    
    toast({
      title: "Message envoyé avec succès",
      description: "Nous vous recontacterons sous 24h avec un devis personnalisé.",
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
    <section id="contact" className="relative py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Minimalist geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_1px,transparent_1px),linear-gradient(-45deg,#000_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        {/* Elegant light rays */}
        <div className="absolute top-20 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-50"></div>
        <div className="absolute top-32 right-1/3 w-px h-48 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30"></div>
        
        {/* Sophisticated glow areas */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-blue-50 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-radial from-purple-50 to-transparent opacity-25 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Premium Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm mb-8 hover:shadow-md transition-all duration-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600 tracking-wide">CONTACT PREMIUM</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight">
              Démarrons votre
              <br />
              <span className="font-normal bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                projet digital
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Recevez un devis personnalisé sous 24h pour votre site web haut de gamme
            </p>
          </div>

          {/* Premium Form Container */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* Main Form Card */}
            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12 md:p-16 hover:shadow-3xl transition-all duration-700">
              
              {/* Form header */}
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Informations du projet</h3>
                  <p className="text-gray-500">Remplissez ce formulaire pour recevoir votre devis</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                  <span className="text-sm text-gray-500 font-medium">En ligne</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Row 1: Name and Email */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Nom et prénom *
                    </label>
                    <div className="relative">
                      <ContactIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="pl-12 h-14 bg-white/50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder="Votre nom complet"
                      />
                      {focusedField === 'name' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email professionnel *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="pl-12 h-14 bg-white/50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder="votre@email.com"
                      />
                      {focusedField === 'email' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone and Business */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-12 h-14 bg-white/50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder="06 00 00 00 00"
                      />
                      {focusedField === 'phone' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Entreprise / Secteur
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <Input
                        name="business"
                        value={formData.business}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('business')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-12 h-14 bg-white/50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder="Nom de votre entreprise"
                      />
                      {focusedField === 'business' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Décrivez votre projet *
                  </label>
                  <div className="relative">
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={6}
                      className="bg-white/50 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
                      placeholder="Parlez-nous de votre vision, vos objectifs, votre secteur d'activité... Plus vous nous en direz, plus notre proposition sera précise."
                    />
                    {focusedField === 'message' && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                    )}
                  </div>
                </div>

                {/* Premium Submit Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Réponse garantie</span> sous 24h
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="w-5 h-5" />
                          Obtenir mon devis
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
          </div>

          {/* Additional info */}
          <div className="text-center mt-16 space-y-4">
            <p className="text-gray-500">
              <span className="font-medium">Confidentiel</span> • Devis sur-mesure • Sans engagement
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <span>🔒 Données sécurisées</span>
              <span>⚡ Réponse rapide</span>
              <span>🎯 Devis personnalisé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
