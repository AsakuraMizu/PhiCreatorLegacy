/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: ((now) =>
      `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`)(
      new Date()
    ),
  },
};

module.exports = config;
