
import { useEffect, useRef } from "react";

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star configuration
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      prevX: number;
      prevY: number;
      size: number;
      color: string;
      opacity: number;
      speed: number;
    }> = [];

    const numStars = 800;
    const speed = 0.5;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        prevX: 0,
        prevY: 0,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.7 ? '#00ffff' : Math.random() > 0.5 ? '#ffffff' : '#c084fc',
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.3
      });
    }

    // Milky Way dust particles
    const dustParticles: Array<{
      x: number;
      y: number;
      radius: number;
      angle: number;
      distance: number;
      speed: number;
      opacity: number;
    }> = [];

    const numDust = 200;
    for (let i = 0; i < numDust; i++) {
      dustParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 300 + 100,
        speed: Math.random() * 0.01 + 0.005,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save current transform
      ctx.save();

      // Translate to center
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Draw stars
      stars.forEach(star => {
        star.prevX = star.x;
        star.prevY = star.y;

        // Move star towards camera
        star.z -= speed * star.speed;

        // Reset star if it's too close
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
          star.z = 1000;
        }

        // Project 3D to 2D
        const x = (star.x / star.z) * 300;
        const y = (star.y / star.z) * 300;

        // Calculate star size based on distance
        const size = (1 - star.z / 1000) * star.size;
        const opacity = (1 - star.z / 1000) * star.opacity;

        if (size > 0.1) {
          // Draw star trail
          if (star.z < 950) {
            ctx.strokeStyle = star.color;
            ctx.globalAlpha = opacity * 0.3;
            ctx.lineWidth = size * 0.5;
            ctx.beginPath();
            ctx.moveTo(star.prevX / (star.z + speed) * 300, star.prevY / (star.z + speed) * 300);
            ctx.lineTo(x, y);
            ctx.stroke();
          }

          // Draw star
          ctx.fillStyle = star.color;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Add twinkle effect
          if (Math.random() > 0.99) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw Milky Way dust
      dustParticles.forEach(dust => {
        dust.angle += dust.speed;
        
        const x = Math.cos(dust.angle) * dust.distance + Math.sin(time * 0.5) * 50;
        const y = Math.sin(dust.angle) * dust.distance * 0.3 + Math.cos(time * 0.3) * 30;

        // Create gradient for dust cloud effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, dust.radius * 3);
        gradient.addColorStop(0, `rgba(138, 43, 226, ${dust.opacity})`);
        gradient.addColorStop(0.5, `rgba(75, 0, 130, ${dust.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');

        ctx.globalAlpha = dust.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, dust.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Restore transform
      ctx.restore();
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default StarField;
