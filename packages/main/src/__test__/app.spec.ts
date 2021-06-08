/**
 * @jest-environment node
 */

import { Application } from 'spectron';
import { setupBrowser } from '@testing-library/webdriverio';

const app = new Application({
  path: require('electron') as unknown as string,
  requireName: 'electronRequire',
  args: ['.'],
});

describe('electron app', () => {
  jest.setTimeout(20000);

  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('main window should be visible', async () => {
    expect(await app.browserWindow.isVisible()).toBe(true);
  });

  it('should not open devtools', async () => {
    expect(await app.webContents.isDevToolsOpened()).toBe(false);
  });

  it('should display heading', async () => {
    const { getByRole } = setupBrowser(app.client);

    const heading = await getByRole('heading', {
      name: 'Hello Electron!',
    });
    expect(heading).toBeDefined();
  });

  it('counter should exist and work', async () => {
    const { getByRole } = setupBrowser(app.client);

    const button = await getByRole('button', {
      name: 'Clicks: 0',
    });
    expect(button).toBeDefined();

    await button.click();
    expect(await button.getText()).toBe('Clicks: 1');
  });
});
