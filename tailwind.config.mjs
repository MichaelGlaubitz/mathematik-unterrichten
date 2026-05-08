/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Warmes, akademisches Farbschema
        ink: {
          50: '#f8f7f4',
          100: '#efece4',
          200: '#dcd5c5',
          300: '#bfb39c',
          400: '#a08f72',
          500: '#857355',
          600: '#6c5c43',
          700: '#564938',
          800: '#3f352a',
          900: '#2a241d',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.800'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-links': theme('colors.accent.600'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-quotes': theme('colors.ink.700'),
            '--tw-prose-quote-borders': theme('colors.accent.500'),
            maxWidth: '70ch',
            fontFamily: theme('fontFamily.serif').join(', '),
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.ink.200'),
            '--tw-prose-headings': theme('colors.ink.50'),
            '--tw-prose-lead': theme('colors.ink.300'),
            '--tw-prose-links': theme('colors.accent.100'),
            '--tw-prose-bold': theme('colors.ink.50'),
            '--tw-prose-counters': theme('colors.ink.300'),
            '--tw-prose-bullets': theme('colors.ink.500'),
            '--tw-prose-hr': theme('colors.ink.700'),
            '--tw-prose-quotes': theme('colors.ink.200'),
            '--tw-prose-quote-borders': theme('colors.accent.500'),
            '--tw-prose-captions': theme('colors.ink.300'),
            '--tw-prose-code': theme('colors.ink.50'),
            '--tw-prose-pre-code': theme('colors.ink.100'),
            '--tw-prose-pre-bg': theme('colors.ink.800'),
            '--tw-prose-th-borders': theme('colors.ink.600'),
            '--tw-prose-td-borders': theme('colors.ink.700'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
