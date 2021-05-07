import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Box, Grid, Tooltip } from '@material-ui/core';
import {
  Fullscreen,
  FullscreenExit,
  Pause,
  PlayArrow,
} from '@material-ui/icons';
import { music } from '/@/managers';
import store from '/@/store';

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
            <Tooltip title="Hotkey: alt+f">
              <IconButton onClick={() => store.preview.toggleFull()}>
                {store.preview.full ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});
