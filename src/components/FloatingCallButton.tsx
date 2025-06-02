
import { useState, useEffect } from "react";
import { Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleCall = () => {
    window.location.href = 'tel:+33123456789';
  };

  return (
    <div 
      className={`fixed right-6 bottom-6 z-50 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cercles technologiques animés */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000">
        <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-2 border border-purple-400/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
        <div className="absolute inset-4 border border-cyan-300/10 rounded-full animate-pulse"></div>
      </div>

      {/* Particules technologiques */}
      <div className={`absolute -inset-8 transition-all duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Effet de scan technologique */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent rounded-full transition-all duration-1000 ${isHovered ? 'opacity-100 animate-tech-scan' : 'opacity-0'}`}></div>
      
      {/* Lueur principale */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/60 to-purple-600/60 rounded-full blur-xl opacity-40 hover:opacity-100 hover:blur-2xl transition-all duration-1000 animate-pulse-glow"></div>
      
      {/* Bouton principal */}
      <div className="relative group">
        <Button 
          onClick={handleCall}
          className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-125 border-2 border-cyan-300/50 hover:border-cyan-200 overflow-hidden group"
        >
          {/* Effet de brillance qui traverse */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Icône avec animation */}
          <Phone className="w-6 h-6 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors duration-300 relative z-10" />
          
          {/* Mini particules dans le bouton */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-3 right-4 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
          </div>
        </Button>

        {/* Indicateur d'appel */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>

        {/* Tooltip au hover */}
        <div className={`absolute right-20 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500/90 to-purple-600/90 backdrop-blur-xl text-white px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap border border-cyan-300/30 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>Appelez maintenant !</span>
          </div>
          <div className="text-xs text-cyan-200 mt-1">Consultation gratuite</div>
          
          {/* Flèche du tooltip */}
          <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-cyan-500/90 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </div>
      </div>

      {/* Ondes de propagation lors du hover */}
      {isHovered && (
        <>
          <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 border-2 border-cyan-300/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </>
      )}
    </div>
  );
};

export default FloatingCallButton;
