
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Building, User, Mic } from "lucide-react";
import VoiceRecognition from "./VoiceRecognition";

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    business: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormFields = ({ formData, handleChange }: ContactFormFieldsProps) => {
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  const handleVoiceTranscript = (transcript: string, field: string) => {
    // Créer un événement synthétique pour la mise à jour
    const syntheticEvent = {
      target: {
        name: field,
        value: transcript.trim()
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    
    handleChange(syntheticEvent);
  };

  const activateVoiceForMessage = () => {
    setShowVoiceInterface(true);
  };

  return (
    <>
      {/* Interface vocale IA - uniquement pour le message */}
      {showVoiceInterface && (
        <div className="mb-8">
          <VoiceRecognition
            onTranscript={handleVoiceTranscript}
            currentField="Message"
          />
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setShowVoiceInterface(false)}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Fermer l'assistant vocal
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-100 mb-3 tracking-wide">
            Nom et prénom *
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition-colors" />
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-14 pl-12 bg-gray-800/50 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="Votre nom complet"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-100 mb-3 tracking-wide">
            Email professionnel *
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition-colors" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-14 pl-12 bg-gray-800/50 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="votre@email.com"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-100 mb-3 tracking-wide">
            Téléphone
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition-colors" />
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-14 pl-12 bg-gray-800/50 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="06 00 00 00 00"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-cyan-100 mb-3 tracking-wide">
            Entreprise / Secteur
          </label>
          <div className="relative group">
            <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-blue-400 transition-colors" />
            <Input
              name="business"
              value={formData.business}
              onChange={handleChange}
              className="h-14 pl-12 bg-gray-800/50 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="Nom de votre entreprise"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-cyan-100 mb-3 tracking-wide">
            Message *
          </label>
          <button
            type="button"
            onClick={activateVoiceForMessage}
            className="flex items-center gap-2 text-xs text-cyan-400 hover:text-blue-400 transition-colors"
          >
            <Mic className="w-3 h-3" />
            Vocal
          </button>
        </div>
        <div className="relative group">
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="bg-gray-800/50 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none backdrop-blur-sm"
            placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </>
  );
};

export default ContactFormFields;
