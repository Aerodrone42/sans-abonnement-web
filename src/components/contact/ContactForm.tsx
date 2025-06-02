
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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Informations du projet</h3>
          <p className="text-gray-500">Remplissez ce formulaire pour nous contacter</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-500 font-medium">En ligne</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <ContactFormFields formData={formData} handleChange={handleChange} />
        <ContactSubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ContactForm;
