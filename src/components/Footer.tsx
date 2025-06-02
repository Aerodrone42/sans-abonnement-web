
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

    // Particules technologiques
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
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 2 - 0.5,
        size: Math.random() * 3 + 1,
        life: 0,
        maxLife: Math.random() * 100 + 50,
        color: Math.random() > 0.5 ? '#00ffff' : '#c084fc'
      };
    };

    // Initialiser les particules
    for (let i = 0; i < 20; i++) {
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

        if (particle.life > particle.maxLife || particle.y < -10) {
          particles[index] = createParticle();
          return;
        }

        const opacity = 1 - (particle.life / particle.maxLife);
        
        // Effet de brillance
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Lignes de connexion entre particules proches
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.3;
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
      {/* Canvas pour les effets de particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60"
      />
      
      {/* Effet de grille technologique */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Effets de brillance animés */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      
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

          {/* Services */}
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
                <li key={index} className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Secteurs */}
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
                <li key={index} className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer flex items-center group">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  {secteur}
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

        {/* Zone SEO avec effet holographique */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <div className="text-center text-gray-400 text-sm relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>
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
