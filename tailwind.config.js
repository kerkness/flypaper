module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.ts",
      "./resources/**/*.tsx",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/aspect-ratio')
    ],
  }