import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Grid, Slider, Typography } from '@material-ui/core';
import { project } from '/@/managers';
import store from '/@/store';

export default observer(function Settings() {
  return (
    <Box margin="20px auto" width="80%">
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography gutterBottom>Music volume</Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => `${Math.round(x * 100)}%`}
            value={store.settings.musicVolume}
            onChange={(_, v) => {
              store.settings.update({
                musicVolume: v as number,
              });
            }}
          />
        </Grid>
        <Grid item>
          <Typography gutterBottom>Fx volume</Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => `${Math.round(x * 100)}%`}
            value={store.settings.fxVolume}
            onChange={(_, v) => {
              store.settings.update({
                fxVolume: v as number,
              });
            }}
          />
        </Grid>
        <Grid item>
          <Typography gutterBottom>Playback rate</Typography>
          <Slider
            min={0.1}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => x.toFixed(1)}
            value={store.settings.rate}
            onChange={(_, v) => {
              store.settings.update({ rate: v as number });
            }}
          />
        </Grid>
        <Grid item>
          <Typography gutterBottom>Background dim</Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => `${Math.round(x * 100)}%`}
            value={store.settings.dim}
            onChange={(_, v) => {
              store.settings.update({ dim: v as number });
            }}
          />
        </Grid>
        <Grid item>
          <Typography gutterBottom>
            Auto save interval (minutes, 0 to disable)
            <br />
            Last save: {project.lastSave ? project.lastSave.fromNow() : 'never'}
          </Typography>
          <Slider
            min={0}
            max={10}
            step={0.5}
            valueLabelDisplay="auto"
            value={store.settings.autosave}
            onChange={(_, v) => {
              store.settings.update({ autosave: v as number });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
});
