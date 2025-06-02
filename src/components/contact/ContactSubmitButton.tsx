
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ContactSubmitButtonProps {
  isSubmitting: boolean;
}

const ContactSubmitButton = ({ isSubmitting }: ContactSubmitButtonProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        <span className="font-medium">Réponse garantie</span> sous 24h
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Envoi en cours...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Envoyer le message
          </div>
        )}
      </Button>
    </div>
  );
};

export default ContactSubmitButton;
