import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Box, Grid, Tooltip } from '@material-ui/core';
import {
  Fullscreen,
  FullscreenExit,
  Movie,
  Pause,
  PlayArrow,
} from '@material-ui/icons';
import { control, music } from '/@/managers';

export default observer(function Tools() {
  return (
    <>
      <Box ml={3} mr={4}>
        <Grid container spacing={1}>
          <Grid item>
            <Tooltip title="Hotkey: space">
              <span>
                <IconButton
                  onClick={() => music.toggle()}
                  disabled={!music.loaded}
                >
                  {music.playing ? <Pause /> : <PlayArrow />}
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Hotkey: alt+w">
              <IconButton onClick={() => control.toggleLive()}>
                <Movie />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Hotkey: alt+f">
              <IconButton onClick={() => control.toggleFull()}>
                {control.full ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});
