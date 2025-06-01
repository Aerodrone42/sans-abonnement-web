import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2563eb',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#06b6d4',
					foreground: '#ffffff'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'dark-blue': '#0f172a',
				'turquoise': '#06b6d4'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			borderWidth: {
				'3': '3px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'slide-down': {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(100vh)',
						opacity: '1'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(5deg)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.4'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'rotate-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'spin-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(0) scale(1)'
					},
					'50%': {
						transform: 'translateY(-10px) scale(1.05)'
					}
				},
				'matrix-rain': {
					'0%': {
						transform: 'translateY(-100vh)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(100vh)',
						opacity: '0'
					}
				},
				'energy-pulse': {
					'0%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': {
						transform: 'scale(1.2)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'hologram-flicker': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'lightning-flash': {
					'0%': {
						opacity: '0',
						filter: 'brightness(1)'
					},
					'15%': {
						opacity: '0.6',
						filter: 'brightness(1.8)'
					},
					'30%': {
						opacity: '0.1',
						filter: 'brightness(1)'
					},
					'45%': {
						opacity: '0.4',
						filter: 'brightness(2)'
					},
					'60%': {
						opacity: '0.05',
						filter: 'brightness(1)'
					},
					'75%': {
						opacity: '0.3',
						filter: 'brightness(1.5)'
					},
					'100%': {
						opacity: '0',
						filter: 'brightness(1)'
					}
				},
				'lightning-glow': {
					'0%': {
						filter: 'blur(2px) brightness(1)',
						opacity: '0.2'
					},
					'50%': {
						filter: 'blur(4px) brightness(1.4)',
						opacity: '0.5'
					},
					'100%': {
						filter: 'blur(2px) brightness(1)',
						opacity: '0.2'
					}
				},
				'lightning-zigzag': {
					'0%': {
						opacity: '0',
						transform: 'translateX(0px) scaleY(0)'
					},
					'25%': {
						opacity: '0.4',
						transform: 'translateX(1px) scaleY(0.4)'
					},
					'50%': {
						opacity: '0.3',
						transform: 'translateX(-1px) scaleY(0.7)'
					},
					'75%': {
						opacity: '0.5',
						transform: 'translateX(2px) scaleY(1)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateX(0px) scaleY(1)'
					}
				},
				'lightning-spark': {
					'0%': {
						opacity: '0',
						transform: 'scale(0) rotate(0deg)',
						filter: 'brightness(1)'
					},
					'40%': {
						opacity: '0.4',
						transform: 'scale(1.1) rotate(3deg)',
						filter: 'brightness(1.8)'
					},
					'80%': {
						opacity: '0.3',
						transform: 'scale(0.9) rotate(-2deg)',
						filter: 'brightness(1.4)'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0) rotate(0deg)',
						filter: 'brightness(1)'
					}
				},
				'lightning-dazzle': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.6)',
						filter: 'blur(15px) brightness(1)'
					},
					'40%': {
						opacity: '0.3',
						transform: 'scale(1.1)',
						filter: 'blur(8px) brightness(1.8)'
					},
					'70%': {
						opacity: '0.2',
						transform: 'scale(1.3)',
						filter: 'blur(12px) brightness(1.4)'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0.9)',
						filter: 'blur(20px) brightness(1)'
					}
				},
				'electric-particle': {
					'0%': {
						opacity: '0',
						transform: 'translate(0px, 0px) scale(0)'
					},
					'30%': {
						opacity: '0.4',
						transform: 'translate(-3px, -8px) scale(1.1)'
					},
					'60%': {
						opacity: '0.3',
						transform: 'translate(6px, -4px) scale(0.9)'
					},
					'100%': {
						opacity: '0',
						transform: 'translate(0px, -15px) scale(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-down': 'slide-down 8s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 6s linear infinite',
				'energy-pulse': 'energy-pulse 2s ease-in-out infinite',
				'hologram-flicker': 'hologram-flicker 1.5s ease-in-out infinite',
				'lightning-flash': 'lightning-flash 4s ease-in-out',
				'lightning-glow': 'lightning-glow 3s ease-in-out infinite',
				'lightning-zigzag': 'lightning-zigzag 5s ease-in-out',
				'lightning-spark': 'lightning-spark 4s ease-in-out infinite',
				'lightning-dazzle': 'lightning-dazzle 6s ease-in-out',
				'lightning-intense': 'lightning-glow 2s ease-in-out infinite',
				'electric-particle': 'electric-particle 5s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
