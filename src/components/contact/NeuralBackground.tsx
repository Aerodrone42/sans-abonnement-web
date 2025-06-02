
const NeuralBackground = () => {
  return (
    <>
      {/* Effet de réseau neuronal de fond */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <circle
                cx={20 + (i % 5) * 80}
                cy={40 + Math.floor(i / 5) * 40}
                r="3"
                fill="currentColor"
                className="text-cyan-400 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              {i < 19 && (
                <line
                  x1={20 + (i % 5) * 80}
                  y1={40 + Math.floor(i / 5) * 40}
                  x2={20 + ((i + 1) % 5) * 80}
                  y2={40 + Math.floor((i + 1) / 5) * 40}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-blue-400/50 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Particules flottantes d'IA */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-float"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </>
  );
};

export default NeuralBackground;
