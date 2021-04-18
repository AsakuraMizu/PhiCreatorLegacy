import React from 'react';
import { observer } from 'mobx-react-lite';
import { PixiRef, Sprite } from '@inlet/react-pixi';
import { background } from '/@/managers';
import store from '/@/store';

export default observer(function Background() {
  const ref = React.useRef<PixiRef<typeof Sprite>>(null);
  const [scale, setScale] = React.useState(1);

  const update = () => {
    if (ref.current && ref.current.texture.width !== 0) {
      const scale = Math.min(
        store.preview.width / ref.current.texture.width,
        store.preview.height / ref.current.texture.height
      );
      setScale(scale);
      console.log(scale);
    }
  };

  React.useEffect(() => {
    ref.current?.texture.on('update', update);
  });

  return (
    <Sprite
      ref={ref}
      image={background.src}
      alpha={store.settings.dim}
      x={store.preview.width / 2}
      y={store.preview.height / 2}
      anchor={0.5}
      scale={[scale, scale]}
    />
  );
});
