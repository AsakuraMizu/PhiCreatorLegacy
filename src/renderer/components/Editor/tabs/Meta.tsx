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
    api.dirSelector().then((res) => api.openProject(res));
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Welcome to PhiCreator</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={openProject} size="small">
          Open/Create Project
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
      </Grid>
    </Box>
  );
});
