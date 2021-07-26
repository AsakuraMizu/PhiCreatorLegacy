import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as PIXI from 'pixi.js';
import {
  PixiComponent,
  applyDefaultProps,
  _ReactPixi,
  PixiRef,
} from '@inlet/react-pixi';
import { background } from '/@/managers';
import store from '/@/store';

class BackgroundSprite extends PIXI.Sprite {
  constructor() {
    super();
  }

  reload(src: string) {
    this.texture = PIXI.Texture.from(src);
    this.texture.onBaseTextureUpdated = () => this.update();
    this.texture.on('update', () => this.update());
    this.texture.baseTexture.update();
  }

  update() {
    const scale = Math.min(
      store.preview.width / this.texture.width,
      store.preview.height / this.texture.height
    );
    this.scale.set(scale, scale);
  }
}

const BackgroundWrapper: React.FC<
  _ReactPixi.Container<BackgroundSprite, { src: string }>
> = PixiComponent('BackgroundWrapper', {
  create() {
    return new BackgroundSprite();
  },
  applyProps(instance, oldProps, newProps) {
    const { src: oldSrc, ...oldRest } = oldProps;
    const { src: newSrc, ...newRest } = newProps;

    applyDefaultProps(instance, oldRest, newRest);

    if (newSrc !== oldSrc && newSrc) {
      instance.reload(newSrc);
    }
  },
});

export default observer(function Background() {
  const ref = React.useRef<PixiRef<typeof BackgroundWrapper>>(null);

  React.useEffect(
    () =>
      reaction(
        () => [store.preview.width, store.preview.height],
        () => {
          if (ref.current) {
            ref.current.update();
          }
        }
      ),
    []
  );

  return (
    <BackgroundWrapper
      ref={ref}
      src={background.src}
      alpha={store.settings.dim}
      x={store.preview.width / 2}
      y={store.preview.height / 2}
      anchor={0.5}
    />
  );
});
