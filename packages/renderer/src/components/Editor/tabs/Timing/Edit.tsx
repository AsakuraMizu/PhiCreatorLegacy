import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Grid, TextField } from '@material-ui/core';
import store from '/@/store';

const IDField = observer(() => (
  <TextField
    fullWidth
    label="ID"
    type="number"
    disabled
    value={store.editor.timing.selectedBpm?.id ?? -1}
  />
));

const TimeField = observer(() => (
  <TextField
    fullWidth
    label="Time"
    type="number"
    value={store.editor.timing.time}
    onChange={(event) => {
      const time = parseFloat(event.target.value);
      if (Number.isFinite(time)) store.editor.timing.updateCurrent({ time });
    }}
  />
));

const BpmField = observer(() => (
  <TextField
    fullWidth
    label="Bpm"
    type="number"
    value={store.editor.timing.bpm}
    onChange={(event) => {
      const bpm = parseFloat(event.target.value);
      if (Number.isFinite(bpm)) store.editor.timing.updateCurrent({ bpm });
    }}
  />
));

const ApplyBtn = observer(() => (
  <Button
    variant="outlined"
    color="primary"
    disabled={store.editor.timing.selectedBpm === undefined}
    onClick={() => store.editor.timing.applyCurrent()}
  >
    Apply
  </Button>
));

export default function Edit(): JSX.Element {
  return (
    <Grid item xs={12} sm container spacing={2} direction="column">
      <Grid item>
        <IDField />
      </Grid>
      <Grid item>
        <TimeField />
      </Grid>
      <Grid item>
        <BpmField />
      </Grid>
      <Grid item>
        <ApplyBtn />
      </Grid>
    </Grid>
  );
}
