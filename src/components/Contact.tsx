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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse transform perspective-1000 rotateX-12"></div>
        
        {/* Particules quantiques flottantes */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${2 + Math.random() * 6}s`,
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
            }}
          />
        ))}
        
        {/* Ondes d'énergie concentriques */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-cyan-500/20 rounded-full animate-ping"></div>
          <div className="absolute top-8 left-8 w-80 h-80 border border-blue-500/30 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute top-16 left-16 w-64 h-64 border border-purple-500/40 rounded-full animate-ping animation-delay-2000"></div>
        </div>
        
        {/* Faisceaux laser diagonaux */}
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40 transform rotate-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30 transform -rotate-12 animate-pulse"></div>
        <div className="absolute top-0 left-2/3 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-35 transform rotate-6 animate-pulse"></div>
        
        {/* Orbes d'énergie plasma */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-radial from-cyan-400/30 to-transparent rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-radial from-purple-400/25 to-transparent rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-radial from-blue-400/35 to-transparent rounded-full blur-2xl animate-bounce-slow" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Matrices de données scrollantes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs font-mono animate-slide-down"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '8s'
              }}
            >
              {Array.from({length: 20}, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section Ultra-Futuriste */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-full mb-6 border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <ContactIcon className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Interface de Contact
              </span>
              <Mail className="w-8 h-8 text-purple-400 ml-3 animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Parlez-nous de votre projet
              </span>
              <br />
              <span className="text-white animate-fade-in">
                Nouvelle Génération
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto px-4 animate-fade-in">
              🚀 Traitement professionnel • 🔮 Analyse experte • ⚡ Réponse rapide garantie
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Formulaire Ultra-Moderne avec éclairs */}
            <div className="w-full order-1 lg:order-1">
              <div className="relative bg-gradient-to-br from-slate-800/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] mx-2 sm:mx-0 overflow-hidden transform transition-all duration-500 hover:shadow-[0_0_80px_rgba(34,211,238,0.4)] hover:scale-[1.02]">
                
                {/* Effet de scan holographique */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -skew-x-12 translate-x-[-100%] animate-[slide-in-right_4s_ease-in-out_infinite]"></div>
                
                {/* Éclairs dynamiques sur hover */}
                {hoveredField && (
                  <>
                    {/* Éclair principal diagonal */}
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-yellow-300 to-transparent opacity-90 transform rotate-12 animate-lightning-flash z-20">
                      <div className="absolute inset-0 bg-white/80 blur-sm animate-lightning-glow"></div>
                      <div className="absolute inset-0 bg-yellow-300/60 blur-md animate-lightning-glow"></div>
                    </div>
                    
                    {/* Éclair secondaire en zigzag */}
                    <div className="absolute top-1/4 right-1/3 w-0.5 h-3/4 animate-lightning-zigzag z-20">
                      <div className="w-full h-1/3 bg-gradient-to-b from-yellow-400 to-transparent transform rotate-6"></div>
                      <div className="w-full h-1/3 bg-gradient-to-b from-transparent via-white to-transparent transform -rotate-12 translate-x-2"></div>
                      <div className="w-full h-1/3 bg-gradient-to-b from-transparent to-yellow-400 transform rotate-6 translate-x-1"></div>
                      <div className="absolute inset-0 bg-white/60 blur-lg animate-lightning-intense"></div>
                    </div>
                    
                    {/* Éclairs périphériques multiples */}
                    <div className="absolute top-10 left-10 w-0.5 h-20 bg-gradient-to-b from-yellow-300 to-transparent transform rotate-45 animate-lightning-spark z-20">
                      <div className="absolute inset-0 bg-white/70 blur-sm"></div>
                    </div>
                    
                    <div className="absolute bottom-20 right-10 w-0.5 h-24 bg-gradient-to-t from-cyan-300 to-transparent transform -rotate-30 animate-lightning-spark z-20" style={{ animationDelay: '0.1s' }}>
                      <div className="absolute inset-0 bg-cyan-300/80 blur-md"></div>
                    </div>
                    
                    <div className="absolute top-1/2 left-4 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-transparent transform rotate-75 animate-lightning-spark z-20" style={{ animationDelay: '0.2s' }}>
                      <div className="absolute inset-0 bg-purple-300/70 blur-sm"></div>
                    </div>
                    
                    {/* Effet d'éblouissement global */}
                    <div className="absolute inset-0 bg-gradient-radial from-yellow-300/20 via-white/10 to-transparent animate-lightning-dazzle z-10"></div>
                    
                    {/* Particules électriques */}
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full z-15 animate-electric-particle"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                          boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)'
                        }}
                      />
                    ))}
                  </>
                )}
                
                {/* Coins technologiques animés */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-3 border-t-3 border-cyan-400 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-3 border-t-3 border-purple-400 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-3 border-b-3 border-blue-400 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-3 border-b-3 border-cyan-400 animate-pulse"></div>

                {/* Particules de données */}
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-float"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${3 + Math.random() * 3}s`
                    }}
                  />
                ))}

                <div className="relative z-10">
                  {/* Header du formulaire */}
                  <div className="flex items-center mb-6">
                    <div className="relative mr-4">
                      <Globe className="w-10 h-10 text-cyan-400 animate-spin-slow" />
                      <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Formulaire de Contact
                      </span>
                    </h3>
                    <div className="relative ml-4">
                      <Sparkles className="w-8 h-8 text-purple-400 animate-bounce" />
                      <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-sm animate-pulse"></div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
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
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-3 text-base hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.3)]"
                            placeholder="Votre nom complet"
                          />
                          {(focusedField === 'name' || hoveredField === 'name') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-xl blur-sm animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
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
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-3 text-base hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.3)]"
                            placeholder="email@domaine.com"
                          />
                          {(focusedField === 'email' || hoveredField === 'email') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-xl blur-sm animate-pulse"></div>
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
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-3 text-base hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.3)]"
                            placeholder="06 12 34 56 78"
                          />
                          {(focusedField === 'phone' || hoveredField === 'phone') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-cyan-400/30 rounded-xl blur-sm animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
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
                            className="w-full bg-slate-800/50 border-2 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-3 text-base hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.3)]"
                            placeholder="Artisan, Commerce, Tech..."
                          />
                          {(focusedField === 'business' || hoveredField === 'business') && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-xl blur-sm animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-bold text-cyan-300 mb-2 flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
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
                          className="w-full resize-none bg-slate-800/50 border-2 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-3 text-base hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.3)]"
                          placeholder="Décrivez votre vision, vos besoins, vos objectifs... Notre équipe analysera chaque détail pour vous proposer la solution parfaite."
                        />
                        {(focusedField === 'message' || hoveredField === 'message') && (
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-xl blur-sm animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={() => setHoveredField('submit')}
                      onMouseLeave={() => setHoveredField(null)}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white py-4 text-lg font-bold rounded-xl transition-all duration-500 transform hover:scale-105 group shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          <Mail className="w-6 h-6 mr-2 animate-bounce" />
                          Envoi en cours...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
                            Envoyer ma demande
                            <Zap className="w-6 h-6 ml-2 animate-bounce" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-cyan-300 px-2 flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-2 animate-pulse" />
                        🔐 Données sécurisées • Expertise certifiée • Réponse garantie sous 24h
                        <Cpu className="w-4 h-4 ml-2 animate-pulse" />
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
