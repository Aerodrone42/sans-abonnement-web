
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo futuriste */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300 transform group-hover:scale-110">
                <Sparkles className="text-white w-6 h-6 animate-pulse" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
            </div>
            <div>
              <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                NOVA
              </span>
              <span className="font-light text-lg text-white ml-1">SITES</span>
              <div className="text-xs text-gray-400 font-medium tracking-wider">INNOVATION • TECHNOLOGIE</div>
            </div>
          </div>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Technologies', id: 'services' },
              { name: 'Réalisations', id: 'portfolio' },
              { name: 'Processus', id: 'process' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)} 
                className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium group py-2"
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            ))}
            
            <Button 
              onClick={() => scrollToSection('contact')} 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 border border-cyan-400/50"
            >
              🚀 Projet gratuit
            </Button>
          </nav>

          {/* Menu mobile futuriste */}
          <button 
            className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-lg border border-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-white/10">
            <nav className="flex flex-col space-y-4 pt-6">
              {[
                { name: 'Technologies', id: 'services' },
                { name: 'Réalisations', id: 'portfolio' },
                { name: 'Processus', id: 'process' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-left text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-2 font-medium"
                >
                  {item.name}
                </button>
              ))}
              
              <Button 
                onClick={() => scrollToSection('contact')} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold mt-4 w-full shadow-lg shadow-cyan-500/25"
              >
                🚀 Projet gratuit
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
