import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Grid,
  TextField,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { meta, project } from '/@/managers';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default observer(function Meta() {
  const cn = useStyles();

  return (
    <Box margin="20px">
      <Grid className={cn.root} container direction="column" spacing={3}>
        <Grid item>
          <TextField
            fullWidth
            label="Title"
            value={meta.title}
            onChange={action((event) => {
              meta.title = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Difficulty"
            value={meta.difficulty}
            onChange={action((event) => {
              meta.difficulty = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Artist"
            value={meta.artist}
            onChange={action((event) => {
              meta.artist = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Illustrator"
            value={meta.illustrator}
            onChange={action((event) => {
              meta.illustrator = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Charter"
            value={meta.charter}
            onChange={action((event) => {
              meta.charter = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Music (file)"
            value={meta.music}
            onChange={action((event) => {
              meta.music = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Background (file)"
            value={meta.background}
            onChange={action((event) => {
              meta.background = event.target.value;
            })}
          />
        </Grid>
        <Grid item>
          <Tooltip title="Hotkey: ctrl+s">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => project.save()}
            >
              Save
            </Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => project.reload()}
            disabled={!project.loaded}
          >
            Reload from disk
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => api.openChartFolder()}>
            Open chart folder
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
});
