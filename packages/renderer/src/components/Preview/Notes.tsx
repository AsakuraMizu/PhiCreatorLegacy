import React from 'react';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import { Container, PixiRef, Sprite, useTick } from '@inlet/react-pixi';
import store from '/@/store';
import SingleJudgeLine from '/@/store/chart/judgeline';
import SingleNote from '/@/store/chart/note';
import { JudgeLineCtx } from './JudgeLineHelper';
import { NoteHelper } from './NoteHelper';
import { JudgerCtx } from './Judger';

import { skin, loaded } from './resources';

interface NoteProp {
  data: Instance<typeof SingleNote>;
  hl?: boolean;
}

const TapNote = observer(({ data, hl }: NoteProp) => {
  const judgeLine = React.useContext(JudgeLineCtx)!;
  const judger = React.useContext(JudgerCtx)!;
  const helper = new NoteHelper(judgeLine, data);
  const note = React.useRef<PixiRef<typeof Sprite>>(null);

  useTick(() => {
    if (note.current) {
      helper.update(note.current, judger.current);
    }
  });

  return (
    <Sprite
      ref={note}
      texture={hl ? loaded.TapHL : loaded.Tap}
      anchor={0.5}
      x={store.preview.x(data.x)}
      scale={[skin.noteRatio * data.width, skin.noteRatio * data.side]}
    />
  );
});

const DragNote = observer(({ data, hl }: NoteProp) => {
  const judgeLine = React.useContext(JudgeLineCtx)!;
  const judger = React.useContext(JudgerCtx)!;
  const helper = new NoteHelper(judgeLine, data);
  const note = React.useRef<PixiRef<typeof Sprite>>(null);

  useTick(() => {
    if (note.current) {
      helper.update(note.current, judger.current);
    }
  });

  return (
    <Sprite
      ref={note}
      texture={hl ? loaded.DragHL : loaded.Drag}
      anchor={0.5}
      x={store.preview.x(data.x)}
      scale={[skin.noteRatio * data.width, skin.noteRatio * data.side]}
    />
  );
});

const FlickNote = observer(({ data, hl }: NoteProp) => {
  const judgeLine = React.useContext(JudgeLineCtx)!;
  const judger = React.useContext(JudgerCtx)!;
  const helper = new NoteHelper(judgeLine, data);
  const note = React.useRef<PixiRef<typeof Sprite>>(null);

  useTick(() => {
    if (note.current) {
      helper.update(note.current, judger.current);
    }
  });

  return (
    <Sprite
      ref={note}
      texture={hl ? loaded.FlickHL : loaded.Flick}
      anchor={0.5}
      x={store.preview.x(data.x)}
      scale={[skin.noteRatio * data.width, skin.noteRatio * data.side]}
    />
  );
});

const HoldNote = observer(({ data }: NoteProp) => {
  const judgeLine = React.useContext(JudgeLineCtx)!;
  const judger = React.useContext(JudgerCtx)!;
  const helper = new NoteHelper(judgeLine, data);
  const note = React.useRef<PixiRef<typeof Container>>(null);
  const hold = React.useRef<PixiRef<typeof Sprite>>(null);
  const holdHead = React.useRef<PixiRef<typeof Sprite>>(null);
  const holdEnd = React.useRef<PixiRef<typeof Sprite>>(null);

  useTick(() => {
    if (note.current && hold.current && holdHead.current && holdEnd.current)
      helper.updateHold(
        note.current,
        hold.current,
        holdHead.current,
        holdEnd.current,
        judger.current
      );
  });

  return (
    <Container
      ref={note}
      x={store.preview.x(data.x)}
      scale={[skin.noteRatio * data.width, skin.noteRatio * data.side]}
    >
      <Sprite ref={holdEnd} texture={loaded.HoldEnd} />
      <Sprite ref={hold} texture={loaded.Hold} />
      <Sprite ref={holdHead} texture={loaded.HoldHead} />
    </Container>
  );
});

const Note = observer(({ data }: NoteProp) => {
  const props = { data, hl: data.hl };
  switch (data.type) {
    case 1:
      return <TapNote {...props} />;
    case 2:
      return <DragNote {...props} />;
    case 3:
      return <HoldNote {...props} />;
    case 4:
      return <FlickNote {...props} />;
  }
});

export default observer(function Notes({
  data,
}: {
  data: Instance<typeof SingleJudgeLine>;
}) {
  return (
    <>
      {data.noteList.map((note) => (
        <Note key={note.id} data={note} />
      ))}
    </>
  );
});
