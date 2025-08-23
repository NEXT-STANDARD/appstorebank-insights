/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      // AppStoreBank ライトテーマデザインシステム
      colors: {
        primary: {
          50: '#f8faff',
          100: '#e6f2ff',
          200: '#cce6ff',
          300: '#99ccff',
          400: '#66b3ff',
          500: '#3399ff',
          600: '#007fff',
          700: '#0066cc',
          800: '#004d99',
          900: '#003366',
        },
        secondary: {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#ffc2d7',
          300: '#ff94bb',
          400: '#ff66a3',
          500: '#ff3399',
          600: '#e6005c',
          700: '#b3004a',
        },
        accent: {
          mint: '#66d9a6',
          peach: '#ffb366',
          lavender: '#b366ff',
          sky: '#66b3ff',
          coral: '#ff8066',
        },
        neutral: {
          50: '#fafbfc',
          100: '#f5f7fa',
          200: '#e4e9f0',
          300: '#c9d2dc',
          400: '#9aa5b5',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(135deg, #f8faff 0%, #e6f2ff 50%, #fff0f5 100%)',
        'primary-gradient': 'linear-gradient(135deg, #3399ff 0%, #66b3ff 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #ff66a3 0%, #ffb366 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
        'soft-gradient': 'linear-gradient(135deg, rgba(51, 153, 255, 0.1) 0%, rgba(255, 102, 163, 0.1) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 4s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
      },
      backdropBlur: {
        'glass': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: '65ch',
            '[class~="lead"]': {
              color: theme('colors.gray.600'),
            },
            a: {
              color: theme('colors.primary.500'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}