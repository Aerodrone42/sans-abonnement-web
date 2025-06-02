
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactHeader from "./contact/ContactHeader";
import ContactForm from "./contact/ContactForm";
import VoiceRecognition from "./contact/VoiceRecognition";
import NeuralBackground from "./contact/NeuralBackground";
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

  // Fonction pour que l'IA puisse pré-remplir le formulaire
  const fillFormFromAI = (aiData: Partial<typeof formData>) => {
    console.log('📝 Contact: Remplissage du formulaire par l\'IA:', aiData);
    setFormData(prevData => ({
      ...prevData,
      ...aiData
    }));
  };

  // Fonction pour que l'IA puisse envoyer automatiquement
  const submitFromAI = async () => {
    if (formData.name && formData.email && formData.message) {
      console.log('🤖 Contact: Envoi automatique par l\'IA');
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('business', formData.business);
        formDataToSend.append('message', formData.message);
        formDataToSend.append('_subject', '🤖 Nouvelle demande générée par l\'IA - Aerodrone Multiservices');
        formDataToSend.append('_captcha', 'false');
        formDataToSend.append('_template', 'table');
        
        const response = await fetch('https://formsubmit.co/aerodrone.multiservices@gmail.com', {
          method: 'POST',
          body: formDataToSend
        });
        
        if (response.ok) {
          toast({
            title: "✅ Message envoyé avec succès !",
            description: "Votre demande a été transmise par l'IA. Vous recevrez une réponse sous 24h.",
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
        console.error('Erreur envoi automatique:', error);
        toast({
          title: "❌ Erreur d'envoi automatique",
          description: "Une erreur s'est produite lors de l'envoi automatique.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <NeuralBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ContactHeader />
          
          <div className="mt-12 space-y-8">
            {/* Composant de reconnaissance vocale avec callbacks */}
            <VoiceRecognition
              onTranscript={() => {}} 
              currentField=""
              fillFormFromAI={fillFormFromAI}
              submitFromAI={submitFromAI}
              formData={formData}
            />
            
            {/* Formulaire de contact */}
            <ContactForm 
              formData={formData}
              setFormData={setFormData}
              fillFormFromAI={fillFormFromAI}
              submitFromAI={submitFromAI}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
