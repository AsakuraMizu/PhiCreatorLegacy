import useOnWindowResize from '@rooks/use-on-window-resize';
import { RefObject, useEffect } from 'react';
import { preload } from './resources';
import Renderer from '.';

export default function useRenderer(
  ref: RefObject<HTMLCanvasElement>
): Renderer | undefined {
  let renderer: Renderer | undefined;

  useEffect(() => {
    Promise.all([preload(), document.fonts.ready]).then(() => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        renderer = new Renderer(ref.current);
      }
    });
    return () => renderer?.destroy();
  }, []);

  useOnWindowResize(() => {
    renderer?.resize();
  });

  return renderer;
}
