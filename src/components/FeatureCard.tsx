
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactElement<any, LucideIcon>;
  title: string;
  description: string;
  gradient: string;
  delay: string;
  particles: string;
}

const FeatureCard = ({ icon, title, description, gradient, delay, particles }: FeatureCardProps) => {
  return (
    <div 
      className="group relative animate-fade-in"
      style={{animationDelay: delay}}
    >
      {/* Quantum Field Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 rounded-3xl blur-2xl transition-all duration-700 scale-110`}></div>
      
      {/* Holographic Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-[2px] group-hover:from-cyan-400/40 group-hover:via-purple-400/40 group-hover:to-pink-400/40 transition-all duration-500">
        <div className="w-full h-full bg-black/80 backdrop-blur-xl rounded-3xl"></div>
      </div>
      
      {/* Main Card Content */}
      <div className="relative p-8 md:p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 group border border-white/10">
        {/* Floating Particles for each card */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-${particles}-400 rounded-full animate-ping`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Premium Icon Container */}
        <div className="relative mb-8">
          <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-700 transform group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden`}>
            {/* Icon Glow Effect */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-white group-hover:animate-pulse z-10">
              {icon}
            </div>
            
            {/* Holographic shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[slide-in-right_0.6s_ease-out] transition-all duration-500"></div>
          </div>
          
          {/* Quantum Orbit Ring */}
          <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/30 rounded-2xl animate-spin-slow transition-all duration-700"></div>
        </div>
        
        {/* Premium Typography */}
        <h3 className="text-xl md:text-2xl font-black text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-500">
          {description}
        </p>

        {/* Tech Status Indicators */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">ACTIF</span>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-1 h-4 bg-gradient-to-t ${gradient} rounded-full opacity-70`}></div>
            ))}
          </div>
        </div>

        {/* Corner Tech Details */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-400 animate-pulse"></div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700">
          <div className="w-3 h-3 border-b-2 border-l-2 border-purple-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
