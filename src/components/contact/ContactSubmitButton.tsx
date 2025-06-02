
import { Button } from "@/components/ui/button";
import { Send, Zap } from "lucide-react";

interface ContactSubmitButtonProps {
  isSubmitting: boolean;
}

const ContactSubmitButton = ({ isSubmitting }: ContactSubmitButtonProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-cyan-400/20">
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-cyan-400">Réponse garantie</span> sous 24h
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="relative px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-blue-500/25 overflow-hidden group"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        
        {isSubmitting ? (
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="tracking-wide">ENVOI EN COURS...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 relative z-10">
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="tracking-wide">ENVOYER LE MESSAGE</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default ContactSubmitButton;
