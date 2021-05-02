import React from 'react';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import * as PIXI from 'pixi.js';
import { Container, Graphics, PixiRef, useTick } from '@inlet/react-pixi';
import store from '/@/store';
import SingleJudgeLine from '/@/store/chart/judgeline';
import { JudgeLineCtx, JudgeLineHelper } from './JudgeLineHelper';
import Notes from './Notes';

import skin from '/@/assets/skin/skin.json';

const JudgeLine = observer(
  ({ data }: { data: Instance<typeof SingleJudgeLine> }) => {
    const helper = new JudgeLineHelper(data);

    const root = React.useRef<PixiRef<typeof Container>>(null);
    const line = React.useRef<PixiRef<typeof Graphics>>(null);
    const notes = React.useRef<PixiRef<typeof Container>>(null);

    useTick(() => {
      if (root.current && line.current && notes.current) {
        helper.update(root.current, line.current, notes.current);
      }
    });

    const draw = React.useCallback((g: PIXI.Graphics) => {
      g.lineStyle(4, skin.color);
      g.moveTo(-10000, 0);
      g.lineTo(10000, 0);
    }, []);

    return (
      <Container ref={root} pivot={[store.preview.x(0), store.preview.y(0)]}>
        <Graphics ref={line} draw={draw} y={store.preview.y(0)} />
        <Container ref={notes}>
          <JudgeLineCtx.Provider value={helper}>
            <Notes data={data} />
          </JudgeLineCtx.Provider>
        </Container>
      </Container>
    );
  }
);

export default observer(function JudgeLines() {
  return (
    <>
      {store.chart.judgeLineList.map((line) => (
        <JudgeLine key={line.id} data={line} />
      ))}
    </>
  );
});
