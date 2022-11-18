module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.ts",
      "./resources/**/*.tsx",
    ],
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/aspect-ratio')
    ],
  }