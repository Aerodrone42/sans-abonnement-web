
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ContactFormFields from "./ContactFormFields";
import ContactSubmitButton from "./ContactSubmitButton";
import NeuralEffects from "./NeuralEffects";
import { Brain, Cpu, Zap } from "lucide-react";

const ContactForm = () => {
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
    
    try {
      // Préparation des données pour FormSubmit
      const formElement = e.target as HTMLFormElement;
      const formDataToSend = new FormData(formElement);
      
      // Envoi via FormSubmit
      const response = await fetch('https://formsubmit.co/aerodrone.multiservices@gmail.com', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        toast({
          title: "✅ Message envoyé avec succès !",
          description: "Votre demande a été transmise à notre équipe. Vous recevrez une réponse sous 24h.",
        });
        
        // Réinitialisation du formulaire
        setFormData({
          name: "",
          email: "",
          phone: "",
          business: "",
          message: ""
        });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur envoi:', error);
      toast({
        title: "❌ Erreur d'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour que l'IA puisse pré-remplir le formulaire
  const fillFormFromAI = (aiData: Partial<typeof formData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...aiData
    }));
  };

  // Fonction pour que l'IA puisse envoyer automatiquement
  const submitFromAI = async () => {
    if (formData.name && formData.email && formData.message) {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="relative">
      {/* Container holographique avec effets neuronaux */}
      <div className="bg-gradient-to-br from-gray-900/95 via-blue-900/50 to-purple-900/95 backdrop-blur-2xl border border-cyan-400/30 rounded-3xl shadow-2xl p-12 relative overflow-hidden">
        
        {/* Effets neuronaux de fond */}
        <NeuralEffects />
        
        {/* Grille holographique animée */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-2 h-full animate-pulse">
            {[...Array(144)].map((_, i) => (
              <div
                key={i}
                className="border border-cyan-400/30 rounded-sm"
                style={{
                  animation: `glow-pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Header IA avancé */}
        <div className="flex items-center justify-between mb-12 pb-8 border-b border-cyan-400/30 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 text-cyan-400 animate-ping opacity-30">
                <Brain className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-2">
                Interface IA Neurale
              </h3>
              <p className="text-gray-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-green-400 animate-pulse" />
                Système de reconnaissance vocale activé
              </p>
            </div>
          </div>
          
          {/* Indicateur d'état IA */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm text-green-400 font-semibold tracking-wide">IA EN LIGNE</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
              <span>Envoi automatique par email</span>
            </div>
          </div>
        </div>

        <form 
          id="contact-form"
          onSubmit={handleSubmit} 
          className="space-y-8 relative z-10"
          action="https://formsubmit.co/aerodrone.multiservices@gmail.com"
          method="POST"
        >
          {/* Champs cachés pour FormSubmit */}
          <input type="hidden" name="_subject" value="🤖 Nouvelle demande générée par l'IA - Aerodrone Multiservices" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          
          <ContactFormFields 
            formData={formData} 
            handleChange={handleChange}
            fillFormFromAI={fillFormFromAI}
            submitFromAI={submitFromAI}
          />
          <ContactSubmitButton isSubmitting={isSubmitting} />
        </form>

        {/* Particules de données flottantes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-12 bg-gradient-to-t from-cyan-400/0 via-cyan-400/60 to-cyan-400/0 opacity-40 rounded-full"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animation: `data-flow ${1.5 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}

        {/* Effet de scan périphérique */}
        <div className="absolute inset-0 rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-tech-scan"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-tech-scan" style={{ animationDelay: '1s' }}></div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent animate-tech-scan" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-tech-scan" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Lueur externe améliorée */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl animate-glow-pulse -z-10"></div>
    </div>
  );
};

export default ContactForm;
