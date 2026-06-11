export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tun: '#050914',
        panel: 'rgba(10, 20, 38, 0.72)',
        neon: '#38bdf8',
        cyanSoft: '#67e8f9',
        danger: '#fb7185',
        success: '#34d399'
      },
      boxShadow: {
        neon: '0 0 32px rgba(56, 189, 248, 0.35)',
        glass: '0 24px 80px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};
