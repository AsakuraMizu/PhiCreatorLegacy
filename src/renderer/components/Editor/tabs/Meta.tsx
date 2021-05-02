import React from 'react';
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
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { InsertDriveFile } from '@material-ui/icons';
import { createStyles, Theme } from '@material-ui/core/styles';
import { project } from '/@/managers';
import store from '/@/store';

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
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Welcome to PhiCreator</Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={async () => {
            const dir = await api.dialog.dirSelector();
            if (!dir) return;
            await api.project.openProject(dir);
            await project.reload(false);
          }}
          size="small"
        >
          Create/Open Project
        </Button>
      </CardActions>
    </Card>
  );
}

export default observer(function Meta() {
  const cn = useStyles();

  const handleFileSelector = async (): Promise<string> => {
    const file = await api.dialog.fileSelector(project.path);
    return api.project.getRelativePath(file);
  };

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
              value={store.meta.title}
              onChange={(event) => {
                store.meta.update({ title: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Difficulty"
              value={store.meta.difficulty}
              onChange={(event) => {
                store.meta.update({ difficulty: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Artist"
              value={store.meta.artist}
              onChange={(event) => {
                store.meta.update({ artist: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Illustrator"
              value={store.meta.illustrator}
              onChange={(event) => {
                store.meta.update({ illustrator: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Charter"
              value={store.meta.charter}
              onChange={(event) => {
                store.meta.update({ charter: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Music (file)"
              value={store.meta.music}
              onChange={(event) => {
                store.meta.update({ music: event.target.value });
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={!project.loaded}
                      onClick={async () => {
                        store.meta.update({
                          music: await handleFileSelector(),
                        });
                      }}
                    >
                      <InsertDriveFile />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid className={cn.row} container direction="row" spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={!project.loaded}
              label="Background (file)"
              value={store.meta.background}
              onChange={(event) => {
                store.meta.update({ background: event.target.value });
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={!project.loaded}
                      onClick={async () => {
                        store.meta.update({
                          background: await handleFileSelector(),
                        });
                      }}
                    >
                      <InsertDriveFile />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              onClick={() => api.project.openProjectFolder()}
            >
              Open chart folder
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});
