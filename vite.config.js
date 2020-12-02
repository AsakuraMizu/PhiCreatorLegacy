/** @type import('vite').UserConfig */
module.exports = {
  plugins: [require('svite')()],
  optimizeDeps: {
    include: [
      'flatpickr',
      'flatpickr/dist/plugins/rangePlugin',
    ],
  },
};
