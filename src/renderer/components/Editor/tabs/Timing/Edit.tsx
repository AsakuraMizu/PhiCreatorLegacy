import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Grid, TextField } from '@material-ui/core';
import { chart } from '/@/managers';
import timing_ from './state';

export default observer(function Edit() {
  const data = chart.data?.bpmList[timing_.selected];

  if (data) {
    return (
      <Grid item xs={12} sm container spacing={2} direction="column">
        <Grid item>
          <TextField
            fullWidth
            label="ID"
            type="number"
            value={data?.id}
            onChange={action((event) => {
              const value = parseInt(event.target.value);
              if (Number.isFinite(value)) data.id = value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Time"
            type="number"
            value={data?.time}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) data.time = value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="bpm"
            type="number"
            value={data?.bpm}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) data.bpm = value;
            })}
          />
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
});
