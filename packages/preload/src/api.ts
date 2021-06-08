/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
export const api = {
  versions: process.versions,
};

export type Api = Readonly<typeof api>;
