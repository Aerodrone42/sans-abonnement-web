
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutoSubmitIndicatorProps {
  formData?: {
    name: string;
    email: string;
    phone: string;
    business: string;
    message: string;
  };
  submitFromAI?: () => Promise<void>;
}

const AutoSubmitIndicator = ({ formData, submitFromAI }: AutoSubmitIndicatorProps) => {
  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    if (formData) {
      const wasEmpty = !formData.name && !formData.email && !formData.phone && !formData.business;
      const hasContent = formData.name || formData.email || formData.phone || formData.business;
      
      if (wasEmpty && hasContent) {
        setIsFormFilled(true);
        console.log('📝 Formulaire rempli par l\'IA détecté');
      }
    }
  }, [formData]);

  const handleAutoSubmit = async () => {
    if (isFormFilled && submitFromAI) {
      console.log('🤖 IA déclenche l\'envoi automatique de l\'email');
      try {
        await submitFromAI();
        setIsFormFilled(false);
        console.log('✅ Email envoyé automatiquement');
      } catch (error) {
        console.error('❌ Erreur envoi automatique:', error);
      }
    }
  };

  if (!isFormFilled) return null;

  return (
    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-blue-200 text-sm">
          🎯 Formulaire automatiquement rempli ! Prêt à envoyer votre demande ?
        </span>
        <Button
          onClick={handleAutoSubmit}
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          Envoyer la demande
        </Button>
      </div>
    </div>
  );
};

export default AutoSubmitIndicator;
