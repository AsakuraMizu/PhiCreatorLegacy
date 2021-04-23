import useOnWindowResize from '@rooks/use-on-window-resize';
import { RefObject, useEffect } from 'react';
import { preload } from './resources';
import Renderer from '.';
import { control } from '../managers';
import { when } from 'mobx';

export default function useRenderer(
  ref: RefObject<HTMLCanvasElement>,
  type: 'live' | 'full',
  resize = false
): Renderer | undefined {
  let renderer: Renderer | undefined;

  useEffect(() => {
    Promise.all([preload(), document.fonts.ready]).then(() => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        renderer = new Renderer(ref.current);
        if (resize) renderer.resize();
      }
    });
  }, []);

  useOnWindowResize(() => {
    if (resize) {
      renderer?.resize();
    }
  });

  when(
    () =>
      (!control.live && type === 'live') ||
      (control.full && type === 'live') ||
      (!control.full && type === 'full'),
    () => {
      renderer?.destroy();
    }
  );

  return renderer;
}
