

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Zap } from "lucide-react";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-2xl border-b border-cyan-400/30 shadow-2xl shadow-cyan-500/25' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo Cyberpunk */}
          <div className="flex items-center space-x-4 group cursor-pointer" onClick={scrollToTop}>
            <div className="relative">
              {/* Main logo container */}
              <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:shadow-cyan-400/70 transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl animate-pulse opacity-50"></div>
              </div>
              
              {/* Holographic glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 -z-10 animate-glow"></div>
              
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col">
                <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-glow">
                  NOVA
                </span>
                <span className="font-light text-xl text-white ml-1 tracking-wider">SITES</span>
              </div>
              <div className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-bold tracking-[0.2em] mt-1">
                FUTUR • INNOVATION • IA
              </div>
              
              {/* Underline animation */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
          
          {/* Navigation Futuriste */}
          <nav className="hidden md:flex items-center space-x-10">
            {[
              { name: 'Technologies', id: 'portfolio', icon: <Code className="w-4 h-4" /> },
              { name: 'Réalisations', id: 'portfolio', icon: <Sparkles className="w-4 h-4" /> },
              { name: 'Processus', id: 'process', icon: <Zap className="w-4 h-4" /> },
              { name: 'Contact', id: 'contact', icon: <Sparkles className="w-4 h-4" /> }
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => scrollToSection(item.id)} 
                className="relative text-gray-300 hover:text-white transition-all duration-500 font-bold group py-3 px-2 flex items-center gap-2"
              >
                <span className="group-hover:animate-pulse">{item.icon}</span>
                {item.name}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-500"></div>
              </button>
            ))}
            
            {/* CTA Button Ultra-Moderne avec Animations Technologiques */}
            <div className="relative group">
              {/* Cercles technologiques animés */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl animate-spin-slow"></div>
                <div className="absolute inset-2 border border-purple-400/20 rounded-xl animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
                <div className="absolute inset-4 border border-cyan-300/10 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Particules technologiques */}
              <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float"></div>
                <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              {/* Effet de scan technologique */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-slide-in-right rounded-2xl transition-all duration-1000"></div>
              
              {/* Lueur principale */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/60 to-purple-600/60 rounded-2xl blur-xl opacity-40 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-1000 animate-pulse-glow"></div>
              
              {/* Bouton principal */}
              <Button 
                onClick={() => scrollToSection('contact')} 
                className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl transition-all duration-500 transform group-hover:scale-110 border-2 border-cyan-300/50 hover:border-cyan-200 text-lg overflow-hidden"
              >
                {/* Effet de brillance qui traverse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Contenu du bouton */}
                <div className="relative flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:animate-bounce group-hover:text-yellow-300 transition-colors duration-300" />
                  <span className="group-hover:text-shadow-lg">PROJET FUTUR</span>
                  
                  {/* Mini particules dans le bouton */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute bottom-3 right-8 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
                  </div>
                </div>
              </Button>
            </div>
          </nav>

          {/* Menu mobile cyberpunk */}
          <button 
            className="md:hidden relative w-12 h-12 flex flex-col justify-center items-center bg-gradient-to-r from-cyan-500/30 to-purple-500/30 backdrop-blur-xl rounded-xl border border-cyan-400/50 shadow-xl hover:shadow-cyan-400/50 transition-all duration-500 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-7 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-7 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 my-1.5 transition-all duration-500 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-7 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Menu mobile holographique */}
        {isMenuOpen && (
          <div className="md:hidden mt-8 pb-8 border-t border-cyan-400/30">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl rounded-b-3xl"></div>
            <nav className="relative flex flex-col space-y-6 pt-8">
              {[
                { name: 'Technologies', id: 'portfolio' },
                { name: 'Réalisations', id: 'portfolio' },
                { name: 'Processus', id: 'process' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-left text-gray-300 hover:text-cyan-400 transition-all duration-500 py-3 font-bold text-lg hover:scale-105 hover:translate-x-2"
                >
                  {item.name}
                </button>
              ))}
              
              <div className="relative group mt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-60"></div>
                <Button 
                  onClick={() => scrollToSection('contact')} 
                  className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-black w-full shadow-2xl text-lg"
                >
                  PROJET FUTUR
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

