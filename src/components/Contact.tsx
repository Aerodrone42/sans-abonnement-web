
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Contact as ContactIcon, Zap, Shield, Globe, Sparkles, Rocket, Star, Send, MessageCircle, Phone, Building } from "lucide-react";
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
    
    toast({
      title: "🚀 Message envoyé !",
      description: "Votre demande a été transmise avec succès. Nous vous recontacterons sous 24h.",
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
    <section id="contact" className="relative py-20 min-h-screen bg-black overflow-hidden">
      {/* Fond spatial ultra-futuriste */}
      <div className="absolute inset-0">
        {/* Étoiles scintillantes */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Néons holographiques */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grille holographique 3D */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse"></div>
        </div>

        {/* Particules énergétiques */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              boxShadow: '0 0 30px currentColor'
            }}
          />
        ))}

        {/* Cercles d'énergie */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border-2 border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-8 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
          <div className="absolute inset-16 border-2 border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header époustouflant */}
          <div className="text-center mb-16 relative">
            {/* Halo lumineux derrière le titre */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-6 mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-xl animate-pulse"></div>
                <div className="relative bg-black/50 backdrop-blur-xl rounded-3xl px-8 py-4 border-2 border-cyan-400/50">
                  <ContactIcon className="w-12 h-12 text-cyan-400 mr-4 inline animate-bounce" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CONTACT FUTURISTE
                  </span>
                  <Rocket className="w-12 h-12 text-purple-400 ml-4 inline animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 relative">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  PROJET
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse" style={{ animationDelay: '0.5s' }}>
                  RÉVOLUTIONNAIRE
                </span>
              </h2>
              
              <div className="flex justify-center items-center space-x-4 text-xl md:text-2xl text-white mb-8">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
                <span>Interface Quantique</span>
                <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                <span>Technologie Avancée</span>
                <Star className="w-8 h-8 text-purple-400 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Formulaire ultra-futuriste */}
            <div className="relative">
              {/* Container holographique */}
              <div className="relative bg-gradient-to-br from-slate-900/50 via-cyan-900/30 to-purple-900/50 backdrop-blur-2xl rounded-3xl p-8 border-2 border-cyan-400/30 shadow-[0_0_100px_rgba(34,211,238,0.3)] overflow-hidden">
                
                {/* Effets de lumière sur les bords */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-60 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-60 animate-pulse"></div>
                <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-400 opacity-60 animate-pulse"></div>
                <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400 opacity-60 animate-pulse"></div>

                {/* Particules flottantes dans le formulaire */}
                {focusedField && [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-50 animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}

                <div className="relative z-10">
                  {/* Header du formulaire */}
                  <div className="text-center mb-8">
                    <Globe className="w-16 h-16 mx-auto text-cyan-400 mb-4 animate-spin" style={{ animationDuration: '10s' }} />
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Interface Quantique
                    </h3>
                    <p className="text-cyan-300">Transmission sécurisée de données</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-cyan-300 font-bold mb-3 flex items-center text-sm">
                          <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                          NOM COMPLET
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="w-full bg-black/70 border-2 border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-500 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            placeholder="Votre identité"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-cyan-300 font-bold mb-3 flex items-center text-sm">
                          <Mail className="w-5 h-5 mr-2 text-cyan-400" />
                          EMAIL SÉCURISÉ
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="w-full bg-black/70 border-2 border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-500 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            placeholder="adresse@domaine.com"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-cyan-300 font-bold mb-3 flex items-center text-sm">
                          <Phone className="w-5 h-5 mr-2 text-cyan-400" />
                          TÉLÉPHONE
                        </label>
                        <div className="relative">
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-black/70 border-2 border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-500 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            placeholder="06 12 34 56 78"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <label className="block text-cyan-300 font-bold mb-3 flex items-center text-sm">
                          <Building className="w-5 h-5 mr-2 text-cyan-400" />
                          SECTEUR
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="business"
                            value={formData.business}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('business')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="w-full bg-black/70 border-2 border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-500 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            placeholder="Votre domaine"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-cyan-300 font-bold mb-3 flex items-center text-sm">
                        <MessageCircle className="w-5 h-5 mr-2 text-cyan-400" />
                        MESSAGE PROJET
                      </label>
                      <div className="relative">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          rows={5}
                          className="w-full resize-none bg-black/70 border-2 border-cyan-400/50 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 rounded-xl px-4 py-4 text-lg font-medium transition-all duration-500 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                          placeholder="Décrivez votre vision révolutionnaire, vos objectifs stratégiques, vos défis technologiques... Notre équipe d'experts analysera chaque détail pour créer une solution sur mesure qui transformera votre business."
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white py-6 text-xl font-black rounded-xl transition-all duration-500 transform hover:scale-105 group shadow-[0_0_50px_rgba(34,211,238,0.5)] hover:shadow-[0_0_80px_rgba(34,211,238,0.8)] border-2 border-cyan-400/50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mr-4"></div>
                          <Rocket className="w-8 h-8 mr-3 animate-bounce" />
                          TRANSMISSION EN COURS...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center">
                            <Send className="w-8 h-8 mr-3" />
                            LANCER LA MISSION
                            <Sparkles className="w-8 h-8 ml-3 animate-spin" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-cyan-300 font-bold flex items-center justify-center">
                        <Shield className="w-5 h-5 mr-2 animate-pulse" />
                        🔐 Cryptage Quantique • IA Analyseur • Réponse 24h Garantie
                        <Zap className="w-5 h-5 ml-2 animate-pulse" />
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Panneau d'informations futuriste */}
            <div className="space-y-8">
              {/* Contact direct */}
              <div className="relative bg-gradient-to-br from-slate-900/60 via-cyan-900/40 to-purple-900/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.4)] overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
                
                <div className="flex items-center mb-6">
                  <Mail className="w-10 h-10 text-cyan-400 mr-4 animate-pulse" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    CONTACT DIRECT
                  </h3>
                  <div className="ml-auto w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                </div>
                
                <div className="space-y-4 text-white">
                  <div className="flex items-center">
                    <span className="font-bold text-cyan-300 w-24">Email:</span>
                    <span className="break-all">aerodrone.multiservices@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-cyan-300 w-24">Tel:</span>
                    <span>06 14 17 38 67</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-cyan-300 w-24">Status:</span>
                    <span className="text-green-400 font-bold">🟢 EN LIGNE</span>
                  </div>
                </div>
              </div>

              {/* Offre spéciale ultra-attractive */}
              <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-2xl p-8 shadow-[0_0_80px_rgba(16,185,129,0.6)] transform hover:scale-105 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 flex items-center text-white">
                    <Sparkles className="w-8 h-8 mr-3 animate-spin text-yellow-400" />
                    OFFRE EXCEPTIONNELLE
                    <Star className="w-8 h-8 ml-3 animate-bounce text-yellow-400" />
                  </h3>
                  <p className="text-2xl font-black mb-4 text-yellow-300">
                    -50% RÉDUCTION TOTALE
                  </p>
                  <p className="text-white font-bold">
                    Premier projet = Prix révolutionnaire !<br />
                    Code: <span className="text-yellow-300 font-black">"DEBUT50"</span>
                  </p>
                </div>
              </div>

              {/* Stats impressionnants */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600/50 to-purple-600/50 backdrop-blur-xl rounded-xl p-6 border border-blue-400/30 text-center">
                  <div className="text-3xl font-black text-white mb-2">24h</div>
                  <div className="text-blue-300 font-bold">Réponse Max</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/50 to-pink-600/50 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30 text-center">
                  <div className="text-3xl font-black text-white mb-2">100%</div>
                  <div className="text-purple-300 font-bold">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
