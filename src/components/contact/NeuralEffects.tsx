
import { useEffect, useRef } from "react";

const NeuralEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    // Particules neurales
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
      energy: number;
    }> = [];

    // Créer des particules
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
        energy: Math.random()
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mettre à jour les particules
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.energy = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;

        // Rebondir sur les bords
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Garder dans les limites
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      });

      // Dessiner les connexions
      particles.forEach((particle, i) => {
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const opacity = (1 - distance / 100) * 0.3 * particle.energy;
              const hue = 180 + (particle.energy * 60);
              
              ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();

              // Effet de pulsation électrique
              if (Math.random() < 0.01) {
                ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.8)`;
                ctx.lineWidth = 2;
                ctx.stroke();
              }
            }
          }
        });
      });

      // Dessiner les particules
      particles.forEach((particle) => {
        const size = 2 + particle.energy * 3;
        const hue = 180 + (particle.energy * 60);
        
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Effet de lueur
        ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default NeuralEffects;
