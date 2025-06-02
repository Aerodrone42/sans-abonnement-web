
import { LucideIcon } from "lucide-react";

interface BusinessImpactCardProps {
  icon: React.ReactElement<any, LucideIcon>;
  title: string;
  description: string;
  metric: string;
  gradient: string;
  glow: string;
  index: number;
}

const BusinessImpactCard = ({ icon, title, description, metric, gradient, glow, index }: BusinessImpactCardProps) => {
  return (
    <div 
      className="group relative"
      style={{animationDelay: `${index * 0.2}s`}}
    >
      {/* Holographic Field */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-40 rounded-3xl blur-3xl transition-all duration-1000 scale-110`}></div>
      
      {/* Quantum Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 p-[3px] group-hover:from-cyan-400/50 group-hover:via-purple-400/50 group-hover:to-pink-400/50 transition-all duration-700">
        <div className="w-full h-full bg-black/90 backdrop-blur-xl rounded-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative p-10 rounded-3xl backdrop-blur-xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-6 group border border-white/20">
        {/* Floating Energy Particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-${glow}-400 rounded-full animate-ping`}
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Premium Icon with Holographic Effect */}
        <div className="relative mb-8">
          <div className={`bg-gradient-to-br ${gradient} p-8 rounded-3xl shadow-2xl group-hover:shadow-${glow}-500/40 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-125 relative overflow-hidden`}>
            {/* Icon Holographic Shine */}
            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-white group-hover:animate-energy-pulse z-10">
              {icon}
            </div>
            
            {/* Quantum Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[slide-in-right_1s_ease-out] transition-all duration-700"></div>
          </div>
          
          {/* Orbital Rings */}
          <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/40 rounded-3xl animate-spin-slow transition-all duration-1000"></div>
          <div className="absolute inset-2 border border-purple-400/0 group-hover:border-purple-400/30 rounded-3xl animate-spin-slow transition-all duration-1000" style={{animationDirection: 'reverse'}}></div>
        </div>
        
        {/* Impact Metrics */}
        <div className="text-center mb-6">
          <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient} mb-2 group-hover:animate-glow`}>
            {metric}
          </div>
          <div className="text-xs text-cyan-400 font-bold tracking-widest">IMPACT MESURÉ</div>
        </div>
        
        {/* Typography with Advanced Effects */}
        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-700">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-500 mb-6">
          {description}
        </p>

        {/* Quantum Status Display */}
        <div className="flex items-center justify-between pt-6 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-xs text-green-400 font-bold tracking-wider">OPTIMISÉ</span>
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-1 h-6 bg-gradient-to-t ${gradient} rounded-full opacity-80 group-hover:animate-pulse`} style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>

        {/* Corner Quantum Indicators */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700">
          <div className="w-4 h-4 border-t-3 border-r-3 border-cyan-400 animate-pulse"></div>
        </div>
        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-1000">
          <div className="w-4 h-4 border-b-3 border-l-3 border-purple-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BusinessImpactCard;
