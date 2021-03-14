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
              data.id = parseInt(event.target.value);
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
              data.time = parseFloat(event.target.value);
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
              data.bpm = parseFloat(event.target.value);
            })}
          />
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
});
