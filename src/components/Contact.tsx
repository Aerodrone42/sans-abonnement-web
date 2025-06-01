import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Calendar, CreditCard, Eye, Zap, Shield, Cpu, Globe, Sparkles } from "lucide-react";
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
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi avec effet de loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Données du formulaire:", formData);
    
    toast({
      title: "🚀 Message envoyé !",
      description: "Votre demande a été transmise avec succès. Nous vous recontacterons sous 24h avec un devis personnalisé.",
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
    <section id="contact" className="relative py-12 md:py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Fond technologique ultra-moderne */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grille holographique 3D */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
        
        {/* Particules quantiques flottantes très lentes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Ondes d'énergie concentriques très lentes */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="w-96 h-96 border border-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-8 left-8 w-80 h-80 border border-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute top-16 left-16 w-64 h-64 border border-purple-500/10 rounded-full animate-ping" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        </div>
        
        {/* Orbes d'énergie plasma très doux */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-radial from-cyan-400/10 to-transparent rounded-full blur-3xl" style={{ animation: 'bounce-slow 20s ease-in-out infinite' }}></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-radial from-purple-400/8 to-transparent rounded-full blur-3xl" style={{ animation: 'bounce-slow 25s ease-in-out infinite', animationDelay: '8s' }}></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-radial from-blue-400/12 to-transparent rounded-full blur-3xl" style={{ animation: 'bounce-slow 18s ease-in-out infinite', animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section Ultra-Futuriste */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-full mb-6 border border-cyan-400/20">
              <ContactIcon className="w-8 h-8 text-cyan-400/80 mr-3" />
              <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Interface de Contact
              </span>
              <Mail className="w-8 h-8 text-purple-400/80 ml-3" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Parlez-nous de votre projet
              </span>
              <br />
              <span className="text-white">
                Nouvelle Génération
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto px-4">
              🚀 Traitement professionnel • 🔮 Analyse experte • ⚡ Réponse rapide garantie
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Formulaire Ultra-Moderne avec effets très doux */}
            <div className="w-full order-1 lg:order-1">
              <div className="relative bg-gradient-to-br from-slate-800/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-400/20 mx-2 sm:mx-0 overflow-hidden transition-all duration-1000 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                
                {/* Effets très doux au survol */}
                {hoveredField && (
                  <>
                    {/* Particules flottantes très douces */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full opacity-20"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animation: `float ${12 + Math.random() * 8}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 4}s`,
                        }}
                      />
                    ))}
                    
                    {/* Lueur très douce qui se propage lentement */}
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-400/3 via-blue-400/2 to-transparent" style={{ animation: 'pulse 6s ease-in-out infinite' }}></div>
                  </>
                )}
                
                {/* Coins technologiques très doux */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/30"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-purple-400/30"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-400/30"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/30"></div>

                <div className="relative z-10">
                  {/* Header du formulaire */}
                  <div className="flex items-center mb-6">
                    <div className="relative mr-4">
                      <Globe className="w-10 h-10 text-cyan-400/80" style={{ animation: 'spin-slow 30s linear infinite' }} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Formulaire de Contact
                      </span>
                    </h3>
                    <div className="relative ml-4">
                      <Sparkles className="w-8 h-8 text-purple-400/80" style={{ animation: 'bounce-slow 8s ease-in-out infinite' }} />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-cyan-400/80" />
                          Nom & Prénom *
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('name')}
                            onMouseLeave={() => setHoveredField(null)}
                            required
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-sm transition-all duration-700 rounded-xl px-4 py-3 text-base hover:border-cyan-400/30"
                            placeholder="Votre nom complet"
                          />
                          {(focusedField === 'name' || hoveredField === 'name') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 rounded-xl blur-sm" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-cyan-400/80" />
                          Email *
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('email')}
                            onMouseLeave={() => setHoveredField(null)}
                            required
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-sm transition-all duration-700 rounded-xl px-4 py-3 text-base hover:border-cyan-400/30"
                            placeholder="email@domaine.com"
                          />
                          {(focusedField === 'email' || hoveredField === 'email') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-xl blur-sm" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('phone')}
                            onMouseLeave={() => setHoveredField(null)}
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-sm transition-all duration-700 rounded-xl px-4 py-3 text-base hover:border-cyan-400/30"
                            placeholder="06 12 34 56 78"
                          />
                          {(focusedField === 'phone' || hoveredField === 'phone') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/5 to-cyan-400/5 rounded-xl blur-sm" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-cyan-400/80" />
                          Secteur d'Activité *
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="business"
                            value={formData.business}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('business')}
                            onBlur={() => setFocusedField(null)}
                            onMouseEnter={() => setHoveredField('business')}
                            onMouseLeave={() => setHoveredField(null)}
                            required
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-sm transition-all duration-700 rounded-xl px-4 py-3 text-base hover:border-cyan-400/30"
                            placeholder="Artisan, Commerce, Tech..."
                          />
                          {(focusedField === 'business' || hoveredField === 'business') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-xl blur-sm" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-cyan-400/80" />
                        Décrivez votre projet
                      </label>
                      <div className="relative">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          onMouseEnter={() => setHoveredField('message')}
                          onMouseLeave={() => setHoveredField(null)}
                          rows={4}
                          className="w-full resize-none bg-slate-800/50 border-2 border-cyan-400/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 backdrop-blur-sm transition-all duration-700 rounded-xl px-4 py-3 text-base hover:border-cyan-400/30"
                          placeholder="Décrivez votre vision, vos besoins, vos objectifs... Notre équipe analysera chaque détail pour vous proposer la solution parfaite."
                        />
                        {(focusedField === 'message' || hoveredField === 'message') && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 rounded-xl blur-sm" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={() => setHoveredField('submit')}
                      onMouseLeave={() => setHoveredField(null)}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white py-4 text-lg font-bold rounded-xl transition-all duration-700 transform hover:scale-[1.02] group shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          <Mail className="w-6 h-6 mr-2" style={{ animation: 'bounce-slow 3s ease-in-out infinite' }} />
                          Envoi en cours...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 mr-2" />
                            Envoyer ma demande
                            <Zap className="w-6 h-6 ml-2" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-cyan-300 px-2 flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-2" />
                        🔐 Données sécurisées • Expertise certifiée • Réponse garantie sous 24h
                        <Cpu className="w-4 h-4 ml-2" />
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Informations de contact modernisées */}
            <div className="w-full order-2 lg:order-2 space-y-8">
              {/* Contact direct */}
              <div className="relative bg-gradient-to-br from-slate-800/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-xl rounded-2xl p-8 text-white mx-2 sm:mx-0 border border-cyan-400/30 overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Mail className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Contact Direct</h3>
                </div>
                <div className="space-y-3">
                  <p className="flex flex-col sm:flex-row sm:items-center text-base">
                    <span className="font-medium mr-2 text-cyan-300">Email :</span>
                    <span className="break-all">aerodrone.multiservices@gmail.com</span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center text-base">
                    <span className="font-medium mr-2 text-cyan-300">Téléphone :</span>
                    <span>06 14 17 38 67</span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center text-base">
                    <span className="font-medium mr-2 text-cyan-300">Horaires :</span>
                    <span>Lun-Ven 9h-18h</span>
                  </p>
                </div>
              </div>

              {/* Paiement et suivi */}
              <div className="bg-gradient-to-br from-slate-800/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 text-white mx-2 sm:mx-0 border border-cyan-400/20">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Paiement & Suivi</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">💳</span>
                    <span><strong>Paiement à la livraison</strong> - Aucun frais à l'avance</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">👀</span>
                    <span><strong>Suivi temps réel</strong> via plateforme dédiée</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">✅</span>
                    <span>Validation professionnelle à chaque étape</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">🔒</span>
                    <span>Sécurité des données garantie</span>
                  </li>
                </ul>
              </div>

              {/* Réponse garantie */}
              <div className="bg-gradient-to-br from-slate-800/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 text-white mx-2 sm:mx-0 border border-cyan-400/20">
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Service Professionnel</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">🔍</span>
                    <span>Analyse experte de votre demande</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">⚡</span>
                    <span>Devis personnalisé sous 24h</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">🎯</span>
                    <span>Recommandations adaptées à vos besoins</span>
                  </li>
                  <li className="flex items-start text-base">
                    <span className="text-cyan-400 mr-2 flex-shrink-0">🚫</span>
                    <span>Zéro spam - Communication professionnelle uniquement</span>
                  </li>
                </ul>
              </div>

              {/* Offre spéciale */}
              <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-2xl p-8 text-white mx-2 sm:mx-0 shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 animate-bounce" />
                  🚀 Offre de Lancement
                </h3>
                <p className="text-lg mb-4">
                  <strong>-50% sur votre premier projet</strong>
                </p>
                <p className="text-sm leading-relaxed">
                  Offre limitée pour nos nouveaux clients. 
                  Mentionnez le code "DEBUT50" dans votre message.
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
