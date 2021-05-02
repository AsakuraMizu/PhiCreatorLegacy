import React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Container, PixiRef, Sprite, Text } from '@inlet/react-pixi';
import { control, music } from '/@/managers';
import store from '/@/store';

import skin from '/@/assets/skin/skin.json';
import _Prefix from '/@/assets/skin/Prefix.png';
import _Pause from '/@/assets/skin/Pause.png';
import _Progress from '/@/assets/skin/Progress.png';

const { ui } = skin;
const { fontFamily, fill, fontSize } = skin.ui;

const Prefix = observer(() => (
  <Sprite
    image={_Prefix}
    x={15}
    y={store.preview.height - 18}
    anchor={[0, 1]}
  />
));

const Pause = observer(() => <Sprite image={_Pause} x={15} y={20} />);

const Progress = observer(() => {
  const ref = React.useRef<PixiRef<typeof Sprite>>(null);

  React.useEffect(
    () =>
      autorun(() => {
        if (ref.current) {
          ref.current.scale.x = store.preview.width / ref.current.texture.width;
        }
      }),
    []
  );

  return (
    <Sprite
      ref={ref}
      image={_Progress}
      x={store.preview.width * music.progress}
      anchor={[1, 0]}
    />
  );
});

const Title = observer(() => (
  <Text
    text={store.meta.title}
    x={38}
    y={store.preview.height - 17}
    anchor={[0, 1]}
    style={{
      fontFamily,
      fill,
      fontSize,
      align: 'left',
    }}
  />
));

const Difficulty = observer(() => (
  <Text
    text={store.meta.difficulty}
    x={store.preview.width - 20}
    y={store.preview.height - 17}
    anchor={[1, 1]}
    style={{
      fontFamily,
      fill,
      fontSize,
      align: 'right',
    }}
  />
));

const Combo = observer(() => (
  <Text
    text={store.preview.combo > 2 ? store.preview.combo.toString() : ''}
    x={store.preview.width / 2}
    y={10}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize: ui.comboFontSize }}
  />
));

const Label = observer(() => (
  <Text
    text={store.preview.combo > 2 ? 'autoplay' : ''}
    x={store.preview.width / 2}
    y={60}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize }}
  />
));

const Score = observer(() => (
  <Text
    text={store.preview.score.toString().padStart(7, '0')}
    x={store.preview.width - 20}
    y={20}
    anchor={[1, 0]}
    style={{ fontFamily, fill, fontSize: ui.scoreFontSize }}
  />
));

const Songname = observer(() => (
  <Text
    text={store.meta.title}
    x={store.preview.width / 2}
    y={store.preview.height * 0.25}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize: ui.comboFontSize, align: 'center' }}
  />
));

const Artist = observer(() => (
  <Text
    text={store.meta.artist}
    x={store.preview.width / 2}
    y={store.preview.height * 0.32}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize, align: 'center' }}
  />
));

const Illustrator = observer(() => (
  <Text
    text={`Illustration designed by ${store.meta.illustrator}`}
    x={store.preview.width / 2}
    y={store.preview.height * 0.6667}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize, align: 'center' }}
  />
));

const Charter = observer(() => (
  <Text
    text={`Chart designed by ${store.meta.charter}`}
    x={store.preview.width / 2}
    y={store.preview.height * 0.73}
    anchor={[0.5, 0]}
    style={{ fontFamily, fill, fontSize, align: 'center' }}
  />
));

const Intro = observer(() => (
  <Container alpha={control.delay >= 500 ? 1 : control.delay / 500}>
    <Songname />
    <Artist />
    <Illustrator />
    <Charter />
  </Container>
));

export default function Ui(): JSX.Element {
  return (
    <>
      <Prefix />
      <Pause />
      <Progress />
      <Title />
      <Difficulty />
      <Combo />
      <Label />
      <Score />
      <Intro />
    </>
  );
}
