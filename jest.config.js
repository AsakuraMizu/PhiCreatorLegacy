module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: './packages/renderer/svelte.config.js',
      },
    ],
    '^.+\\.ts$': 'esbuild-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
};
