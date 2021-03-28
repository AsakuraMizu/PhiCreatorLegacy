import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import type { NoteData } from '/@/common';
import track from './state';

const SingleEdit = observer(() => {
  const idx = [...track.selected.values()][0];
  const data = track.lineData?.noteList[idx];

  if (data) {
    return (
      <Grid container spacing={3} direction="column">
        <Grid item>
          <TextField
            fullWidth
            label="ID"
            type="number"
            value={data.id}
            onChange={action((event) => {
              data.id = parseInt(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              value={data.type}
              onChange={action((event) => {
                data.type = event.target.value as NoteData['type'];
              })}
            >
              <MenuItem value={1}>Tap</MenuItem>
              <MenuItem value={2}>Drag</MenuItem>
              <MenuItem value={3}>Hold</MenuItem>
              <MenuItem value={4}>Flick</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Time"
            type="number"
            value={data.time}
            onChange={action((event) => {
              data.time = parseFloat(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Hold time"
            type="number"
            value={data.holdTime}
            disabled={data.type !== 3}
            onChange={action((event) => {
              data.holdTime = parseFloat(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="X"
            type="number"
            value={data.x}
            onChange={action((event) => {
              data.x = parseFloat(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Width"
            type="number"
            value={data.width}
            onChange={action((event) => {
              data.width = parseFloat(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <FormLabel>Side</FormLabel>
            <RadioGroup
              row
              value={data.side}
              onChange={action((event) => {
                data.side = parseInt(event.target.value) as NoteData['side'];
              })}
            >
              <FormControlLabel value={1} label="1" control={<Radio />} />
              <FormControlLabel value={-1} label="-1" control={<Radio />} />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Speed (factor)"
            type="number"
            value={data.speed}
            onChange={action((event) => {
              data.speed = parseFloat(event.target.value);
            })}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            label="Is fake"
            control={
              <Switch
                checked={data.isFake}
                onChange={action((event) => {
                  data.isFake = Boolean(event.target.value);
                })}
              />
            }
          />
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
});

export interface NoteEditProps {
  open: boolean;
  onClose: () => void;
}

export default observer(function NoteEdit({
  open,
  onClose,
}: NoteEditProps): JSX.Element {
  return (
    <Dialog onClose={onClose} open={open} fullScreen>
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box margin="10px">
        {track.selected.size === 1 ? <SingleEdit /> : <></>}
      </Box>
    </Dialog>
  );
});
