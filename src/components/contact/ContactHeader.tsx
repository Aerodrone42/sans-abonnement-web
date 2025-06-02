
const ContactHeader = () => {
  return (
    <div className="text-center mb-16 relative">
      {/* Holographic badge effect */}
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mb-8 border border-cyan-400/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-tech-scan"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
        <span className="text-sm font-bold text-cyan-100 tracking-wider relative z-10">CONTACT</span>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
      </div>
      
      {/* Animated title with glow effect */}
      <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-6 relative">
        <span className="relative inline-block">
          Contactez-nous
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 animate-pulse"></div>
        </span>
      </h2>
      
      {/* Subtitle with typing effect */}
      <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed relative">
        <span className="inline-block overflow-hidden border-r-2 border-cyan-400 animate-pulse">
          Discutons de votre projet et créons quelque chose d'exceptionnel ensemble
        </span>
      </p>

      {/* Floating geometric shapes */}
      <div className="absolute -top-10 -left-10 w-20 h-20 border-2 border-cyan-400/30 rounded-lg animate-spin-slow"></div>
      <div className="absolute -top-5 -right-5 w-12 h-12 border-2 border-purple-400/30 rounded-full animate-bounce-slow"></div>
      <div className="absolute -bottom-5 left-1/4 w-8 h-8 border-2 border-blue-400/30 transform rotate-45 animate-float"></div>
    </div>
  );
};

export default ContactHeader;
