
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Building } from "lucide-react";

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
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nom et prénom *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Email professionnel *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 pl-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="votre@email.com"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-12 pl-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="06 00 00 00 00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Entreprise / Secteur
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              name="business"
              value={formData.business}
              onChange={handleChange}
              className="h-12 pl-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Nom de votre entreprise"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Message *
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          placeholder="Décrivez votre projet..."
        />
      </div>
    </>
  );
};

export default ContactFormFields;
