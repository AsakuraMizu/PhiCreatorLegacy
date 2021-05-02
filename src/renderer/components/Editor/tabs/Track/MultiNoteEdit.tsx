import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  Switch,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import store from '/@/store';
import SingleNote from '/@/store/chart/note';

interface MultiNoteEditLocalStateData {
  editWidth: boolean;
  width: number;
  editSide: boolean;
  side: 1 | -1;
  editSpeed: boolean;
  speed: number;
  editIsFake: boolean;
  isFake: boolean;
}

interface MultiNoteEditLocalState extends MultiNoteEditLocalStateData {
  update(data: Partial<MultiNoteEditLocalStateData>): void;
}

interface FieldProp {
  state: MultiNoteEditLocalState;
}

const WidthField = observer(({ state }: FieldProp) => (
  <>
    {!state.editWidth ? (
      <Button
        color="primary"
        startIcon={<Edit />}
        onClick={() => state.update({ editWidth: true })}
      >
        Width
      </Button>
    ) : (
      <TextField
        fullWidth
        label="Width"
        type="number"
        value={state.width}
        inputProps={{ min: '0', step: '0.1' }}
        onChange={(event) => {
          const width = parseFloat(event.target.value);
          if (Number.isFinite(width)) state.update({ width });
        }}
      />
    )}
  </>
));

const SideField = observer(({ state }: FieldProp) => (
  <>
    {!state.editSide ? (
      <Button
        color="primary"
        startIcon={<Edit />}
        onClick={() => state.update({ editSide: true })}
      >
        Side
      </Button>
    ) : (
      <FormControl>
        <FormLabel>Side</FormLabel>
        <RadioGroup
          row
          value={state.side}
          onChange={(event) => {
            const side = parseInt(event.target.value) as 1 | -1;
            state.update({ side });
          }}
        >
          <FormControlLabel value={1} label="1" control={<Radio />} />
          <FormControlLabel value={-1} label="-1" control={<Radio />} />
        </RadioGroup>
      </FormControl>
    )}
  </>
));

const SpeedField = observer(({ state }: FieldProp) => (
  <>
    {!state.editSpeed ? (
      <Button
        color="primary"
        startIcon={<Edit />}
        onClick={() => state.update({ editSpeed: true })}
      >
        Speed (factor)
      </Button>
    ) : (
      <TextField
        fullWidth
        label="Speed (factor)"
        type="number"
        value={state.speed}
        inputProps={{ min: '0', step: '0.1' }}
        onChange={(event) => {
          const speed = parseFloat(event.target.value);
          if (Number.isFinite(speed)) {
            state.update({ speed });
          }
        }}
      />
    )}
  </>
));

const IsFakeField = observer(({ state }: FieldProp) => (
  <>
    {!state.editIsFake ? (
      <Button
        color="primary"
        startIcon={<Edit />}
        onClick={() => state.update({ editIsFake: true })}
      >
        Is fake
      </Button>
    ) : (
      <FormControlLabel
        label="Is fake"
        control={
          <Switch
            checked={state.isFake}
            onChange={(event) => {
              const isFake = Boolean(event.target.checked);
              state.update({ isFake });
            }}
          />
        }
      />
    )}
  </>
));

export default observer(function MultiNoteEdit({
  data,
}: {
  data: Instance<typeof SingleNote>[];
}) {
  const state: MultiNoteEditLocalState = useLocalObservable(() => ({
    editWidth: false,
    width: data[0].width,
    editSide: false,
    side: data[0].side,
    editSpeed: false,
    speed: data[0].speed,
    editIsFake: false,
    isFake: data[0].isFake,
    update(data) {
      Object.assign(this, data);
    },
  }));

  const apply = () => {
    const {
      editWidth,
      width,
      editSide,
      side,
      editSpeed,
      speed,
      editIsFake,
      isFake,
    } = state;
    const toUpdate = {
      ...(editWidth && { width }),
      ...(editSide && { side }),
      ...(editSpeed && { speed }),
      ...(editIsFake && { isFake }),
    };
    const { history } = store.chart;
    history.startGroup(() => 0);
    data.forEach((note) => () => note.update(toUpdate));
    history.stopGroup();
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <WidthField state={state} />
      </Grid>
      <Grid item>
        <SideField state={state} />
      </Grid>
      <Grid item>
        <SpeedField state={state} />
      </Grid>
      <Grid item>
        <IsFakeField state={state} />
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={apply}>
          Apply
        </Button>
      </Grid>
    </Grid>
  );
});
