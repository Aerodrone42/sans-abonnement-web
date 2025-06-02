
import ContactHeader from "./contact/ContactHeader";
import ContactForm from "./contact/ContactForm";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Matrix-style grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {[...Array(144)].map((_, i) => (
            <div
              key={i}
              className="border border-cyan-400 opacity-20"
              style={{
                animation: `glow-pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ContactHeader />
          <ContactForm />
          
          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-300">
              <span className="font-medium text-cyan-400 animate-pulse">Confidentiel</span> • Sans engagement
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                🔒 <span className="tech-scan">Données sécurisées</span>
              </span>
              <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                ⚡ <span className="tech-scan">Réponse rapide</span>
              </span>
              <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                🎯 <span className="tech-scan">Support personnalisé</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
