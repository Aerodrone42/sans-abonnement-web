
const ContactHeader = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full mb-8">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-600 tracking-wide">CONTACT</span>
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
      </div>
      
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6">
        Contactez-nous
      </h2>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Discutons de votre projet et créons quelque chose d'exceptionnel ensemble
      </p>
    </div>
  );
};

export default ContactHeader;
