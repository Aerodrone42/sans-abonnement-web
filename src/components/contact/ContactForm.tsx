
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ContactFormFields from "./ContactFormFields";
import ContactSubmitButton from "./ContactSubmitButton";

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
    
    // Simulation d'envoi avec effet visuel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Données du formulaire:", formData);
    
    toast({
      title: "Message envoyé avec succès",
      description: "Nous vous recontacterons sous 24h.",
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
    <div className="relative">
      {/* Holographic container */}
      <div className="bg-gradient-to-br from-gray-900/80 via-blue-900/40 to-purple-900/80 backdrop-blur-xl border border-cyan-400/20 rounded-3xl shadow-2xl p-12 relative overflow-hidden">
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 animate-glow-pulse"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-2 h-full">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-cyan-400"></div>
            ))}
          </div>
        </div>

        {/* Header with tech effect */}
        <div className="flex items-center justify-between mb-12 pb-8 border-b border-cyan-400/20 relative z-10">
          <div>
            <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-3">
              Informations du projet
            </h3>
            <p className="text-gray-400">Remplissez ce formulaire pour nous contacter</p>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-full">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-green-400 font-semibold tracking-wide">EN LIGNE</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <ContactFormFields formData={formData} handleChange={handleChange} />
          <ContactSubmitButton isSubmitting={isSubmitting} />
        </form>

        {/* Floating data particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-gradient-to-t from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-30"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `data-flow ${2 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* External glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/5 to-purple-400/5 rounded-3xl blur-3xl -z-10"></div>
    </div>
  );
};

export default ContactForm;
