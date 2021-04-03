import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Box, Grid } from '@material-ui/core';
import {
  Fullscreen,
  FullscreenExit,
  Pause,
  PlayArrow,
  Save,
} from '@material-ui/icons';
import { control, music, project } from '/@/managers';

export default observer(function Tools() {
  return (
    <>
      <Box ml={3} mr={4}>
        <Grid container spacing={1}>
          <Grid item>
            <IconButton onClick={() => music.toggle()} disabled={!music.loaded}>
              {music.playing ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => project.save()}
              disabled={!project.loaded}
            >
              <Save />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => control.toggleFull()}>
              {control.full ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});
