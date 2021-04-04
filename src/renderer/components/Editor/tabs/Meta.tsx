import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Grid,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { meta, project } from '/@/managers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    row: {
      padding: theme.spacing(1),
    },
  })
);

function WelcomeCard() {
  function openProject() {
    api.dirSelector().then((result) => {
      if (result) project.load(result);
    });
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Welcome to PhiCreator</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={openProject} size="small">
          Create/Open Project
        </Button>
      </CardActions>
    </Card>
  );
}

export default observer(function Meta() {
  const cn = useStyles();

  return (
    <Box margin="20px">
      <Grid className={cn.root} container direction="column" spacing={2}>
        <Grid item xs>
          <WelcomeCard />
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Title"
              value={meta.title}
              onChange={action((event) => {
                meta.title = event.target.value;
              })}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Difficulty"
              value={meta.difficulty}
              onChange={action((event) => {
                meta.difficulty = event.target.value;
              })}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Artist"
              value={meta.artist}
              onChange={action((event) => {
                meta.artist = event.target.value;
              })}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Illustrator"
              value={meta.illustrator}
              onChange={action((event) => {
                meta.illustrator = event.target.value;
              })}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Charter"
              value={meta.charter}
              onChange={action((event) => {
                meta.charter = event.target.value;
              })}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Music (file)"
              value={meta.music}
              onChange={action((event) => {
                meta.music = event.target.value;
              })}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Background (file)"
              value={meta.background}
              onChange={action((event) => {
                meta.background = event.target.value;
              })}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item>
            <Tooltip title="Hotkey: ctrl+s">
              <span>
                <Button
                  disabled={!project.loaded}
                  variant="outlined"
                  color="primary"
                  onClick={() => project.save()}
                >
                  Save
                </Button>
              </span>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Hotkey: alt+r">
              <span>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => project.reload()}
                  disabled={!project.loaded}
                >
                  Reload from disk
                </Button>
              </span>
            </Tooltip>
          </Grid>
          <Grid item>
            <Button
              disabled={!project.loaded}
              variant="outlined"
              onClick={() => api.openChartFolder()}
            >
              Open chart folder
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});
