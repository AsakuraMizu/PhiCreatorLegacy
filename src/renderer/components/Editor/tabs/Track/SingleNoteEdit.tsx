import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
} from '@material-ui/core';
import SingleNote from '/@/store/chart/note';

interface SingleNoteEditLocalStateData {
  id: number;
  type: 1 | 2 | 3 | 4;
  time: number;
  holdTime: number;
  x: number;
  width: number;
  side: 1 | -1;
  speed: number;
  isFake: boolean;
}

interface SingleNoteEditLocalState extends SingleNoteEditLocalStateData {
  update(data: Partial<SingleNoteEditLocalStateData>): void;
}

interface FieldProp {
  state: SingleNoteEditLocalState;
}

const IDField = observer(({ state }: FieldProp) => (
  <TextField fullWidth label="ID" type="number" disabled value={state.id} />
));

const TypeField = observer(({ state }: FieldProp) => (
  <FormControl>
    <InputLabel>Type</InputLabel>
    <Select
      value={state.type}
      onChange={(event) => {
        state.update({ type: event.target.value as 1 | 2 | 3 | 4 });
      }}
    >
      <MenuItem value={1}>Tap</MenuItem>
      <MenuItem value={2}>Drag</MenuItem>
      <MenuItem value={3}>Hold</MenuItem>
      <MenuItem value={4}>Flick</MenuItem>
    </Select>
  </FormControl>
));

const TimeField = observer(({ state }: FieldProp) => (
  <TextField
    fullWidth
    label="Time"
    type="number"
    value={state.time}
    onChange={(event) => {
      const time = parseFloat(event.target.value);
      if (Number.isFinite(time)) state.update({ time });
    }}
  />
));

const HoldTimeField = observer(({ state }: FieldProp) => (
  <TextField
    fullWidth
    label="Hold time"
    type="number"
    value={state.holdTime}
    disabled={state.type !== 3}
    onChange={(event) => {
      const holdTime = parseFloat(event.target.value);
      if (Number.isFinite(holdTime)) state.update({ holdTime });
    }}
  />
));

const XField = observer(({ state }: FieldProp) => (
  <TextField
    fullWidth
    label="X"
    type="number"
    value={state.x}
    inputProps={{ step: '0.1', min: '-1', max: '1' }}
    onChange={(event) => {
      const x = parseFloat(event.target.value);
      if (Number.isFinite(x)) state.update({ x });
    }}
  />
));

const WidthField = observer(({ state }: FieldProp) => (
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
));

const SideField = observer(({ state }: FieldProp) => (
  <FormControl>
    <FormLabel>Side</FormLabel>
    <RadioGroup
      row
      value={state.side}
      onChange={(event) => {
        state.update({ side: parseInt(event.target.value) as 1 | -1 });
      }}
    >
      <FormControlLabel value={1} label="1" control={<Radio />} />
      <FormControlLabel value={-1} label="-1" control={<Radio />} />
    </RadioGroup>
  </FormControl>
));

const SpeedField = observer(({ state }: FieldProp) => (
  <TextField
    fullWidth
    label="Speed (factor)"
    type="number"
    value={state.speed}
    inputProps={{ min: '0', step: '0.1' }}
    onChange={(event) => {
      const speed = parseFloat(event.target.value);
      if (Number.isFinite(speed)) state.update({ speed });
    }}
  />
));

const IsFakeField = observer(({ state }: FieldProp) => (
  <FormControlLabel
    label="Is fake"
    control={
      <Switch
        checked={state.isFake}
        onChange={(event) => {
          state.update({ isFake: Boolean(event.target.checked) });
        }}
      />
    }
  />
));

export default observer(function SingleNoteEdit({
  data,
}: {
  data: Instance<typeof SingleNote>;
}) {
  const state: SingleNoteEditLocalState = useLocalObservable(() => ({
    id: data.id,
    type: data.type,
    time: data.time,
    holdTime: data.holdTime,
    x: data.x,
    width: data.width,
    side: data.side,
    speed: data.speed,
    isFake: data.isFake,
    update(data) {
      Object.assign(this, data);
    },
  }));

  const apply = () => {
    const { type, time, holdTime, x, width, side, speed, isFake } = state;
    data.update({ type, time, holdTime, x, width, side, speed, isFake });
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <IDField state={state} />
      </Grid>
      <Grid item>
        <TypeField state={state} />
      </Grid>
      <Grid item>
        <TimeField state={state} />
      </Grid>
      <Grid item>
        <HoldTimeField state={state} />
      </Grid>
      <Grid item>
        <XField state={state} />
      </Grid>
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
