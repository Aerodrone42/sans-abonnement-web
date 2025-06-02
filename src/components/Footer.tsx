
import { useEffect, useRef } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particules technologiques réparties sur toute la largeur
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width, // Répartition sur toute la largeur
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.8, // Augmenté pour plus de mouvement
        vy: -Math.random() * 2.5 - 0.8, // Augmenté pour plus de dynamisme
        size: Math.random() * 4 + 1,
        life: 0,
        maxLife: Math.random() * 120 + 60,
        color: Math.random() > 0.3 ? '#00ffff' : '#c084fc'
      };
    };

    // Augmenté le nombre de particules pour couvrir toute la largeur
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle());
    }

    let time = 0;

    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mise à jour et rendu des particules
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        if (particle.life > particle.maxLife || particle.y < -10 || particle.x < -10 || particle.x > canvas.width + 10) {
          particles[index] = createParticle();
          return;
        }

        const opacity = 1 - (particle.life / particle.maxLife);
        
        // Effet de brillance
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = particle.color;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Lignes de connexion entre particules proches sur toute la largeur
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.25;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 overflow-hidden">
      {/* Canvas pour les effets de particules sur toute la largeur */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-70"
      />
      
      {/* Effet de grille technologique étendu */}
      <div className="absolute inset-0 opacity-8">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Effets de brillance animés répartis */}
      <div className="absolute top-0 left-1/6 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-25 animate-pulse" />
      <div className="absolute top-0 left-2/6 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-25 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-4/6 w-px h-full bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-0 right-1/6 w-px h-full bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-400/25">
                <span className="text-white font-bold text-sm animate-pulse">SI</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Site Internet Sans Abonnement
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Spécialiste de la création de sites internet sans abonnement pour artisans, 
              commerçants et indépendants. Votre site professionnel, sans engagement.
            </p>
            <div className="flex space-x-4">
              <span className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 transition-shadow duration-300">
                Sans abonnement
              </span>
              <span className="bg-gradient-to-r from-purple-500 to-purple-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-purple-400/25 hover:shadow-purple-400/40 transition-shadow duration-300">
                Livré en 4 jours
              </span>
            </div>
          </div>

          {/* Services avec effet de poussière dorée */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
              Nos services
            </h3>
            <ul className="space-y-3 text-gray-300">
              {[
                "Site vitrine professionnel",
                "Optimisation SEO",
                "Adaptation mobile",
                "Hébergement sécurisé",
                "Formation incluse",
                "Support technique"
              ].map((service, index) => (
                <li key={index} className="relative overflow-hidden cursor-pointer group/item">
                  <div className="relative z-10 flex items-center transition-all duration-500 hover:translate-x-2 hover:text-yellow-300 group-hover/item:animate-pulse">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover/item:w-2 group-hover/item:bg-yellow-400 transition-all duration-300"></span>
                    <span className="relative">
                      {service}
                      {/* Effet de dispersion en poussière dorée */}
                      <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-electric-particle"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${2 + Math.random() * 2}s`
                            }}
                          />
                        ))}
                      </div>
                    </span>
                  </div>
                  {/* Effet de reconstitution */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent scale-x-0 group-hover/item:scale-x-100 origin-left transition-transform duration-700"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Secteurs avec effet de poussière dorée */}
          <div className="group">
            <h3 className="font-bold text-lg mb-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
              Secteurs d'activité
            </h3>
            <ul className="space-y-3 text-gray-300">
              {[
                "Artisans du bâtiment",
                "Commerces de proximité", 
                "Restaurants & bars",
                "Professions libérales",
                "Auto-entrepreneurs",
                "Services à la personne"
              ].map((secteur, index) => (
                <li key={index} className="relative overflow-hidden cursor-pointer group/item">
                  <div className="relative z-10 flex items-center transition-all duration-500 hover:translate-x-2 hover:text-yellow-300 group-hover/item:animate-pulse">
                    <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover/item:w-2 group-hover/item:bg-yellow-400 transition-all duration-300"></span>
                    <span className="relative">
                      {secteur}
                      {/* Effet de dispersion en poussière dorée */}
                      <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-electric-particle"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${2 + Math.random() * 2}s`
                            }}
                          />
                        ))}
                      </div>
                    </span>
                  </div>
                  {/* Effet de reconstitution */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent scale-x-0 group-hover/item:scale-x-100 origin-left transition-transform duration-700"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="border-t border-gray-700/50 pt-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              {[
                "Mentions légales",
                "CGV", 
                "Politique de confidentialité",
                "Plan du site"
              ].map((link, index) => (
                <a key={index} href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group">
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} Site Internet Sans Abonnement. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Zone SEO avec effet holographique étendu */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="text-center text-gray-400 text-sm relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/10 to-cyan-400/5 animate-pulse"></div>
            <p className="mb-2 relative z-10">
              <strong className="text-cyan-400">Création site internet sans abonnement</strong> | Site vitrine professionnel | 
              Site internet pas cher | Site web sur mesure
            </p>
            <p className="relative z-10">
              Création de site internet pour artisans, commerçants, indépendants partout en France. 
              Paiement en une fois, hébergement inclus, sans engagement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
