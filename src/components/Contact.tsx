
import ContactHeader from "./contact/ContactHeader";
import ContactForm from "./contact/ContactForm";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ContactHeader />
          <ContactForm />
          
          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-500">
              <span className="font-medium">Confidentiel</span> • Sans engagement
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <span>🔒 Données sécurisées</span>
              <span>⚡ Réponse rapide</span>
              <span>🎯 Support personnalisé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
