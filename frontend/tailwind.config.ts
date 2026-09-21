import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        brand: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        app: '480px',
        site: '1120px',
        content: '560px',
      },
      colors: {
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        sunken: 'var(--color-sunken)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        'primary-soft': 'var(--color-primary-soft)',
        secondary: 'var(--color-secondary)',
        'secondary-dark': 'var(--color-secondary-dark)',
        'secondary-soft': 'var(--color-secondary-soft)',
        ink: 'var(--color-ink)',
        'secondary-text': 'var(--color-secondary-text)',
        muted: 'var(--color-muted)',
        hint: 'var(--color-hint)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
} satisfies Config;
