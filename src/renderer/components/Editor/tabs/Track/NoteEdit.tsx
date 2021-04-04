/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
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
  Button,
} from '@material-ui/core';
import type { NoteData } from '/@/common';
import { chart } from '/@/managers';
import track from './state';
import { Edit } from '@material-ui/icons';

const SingleEdit = observer(() => {
  const data = track.lineData?.noteList[[...track.selected.values()][0]];

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
              const value = parseInt(event.target.value);
              if (Number.isFinite(value)) {
                data.id = value;
                chart.patch();
              }
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
                chart.patch();
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
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                data.time = value;
                chart.patch();
              }
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
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                data.holdTime = value;
                chart.patch();
              }
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="X"
            type="number"
            value={data.x}
            inputProps={{ step: '0.1', min: '-1', max: '1' }}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                data.x = value;
                chart.patch();
              }
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Width"
            type="number"
            value={data.width}
            inputProps={{ min: '0', step: '0.1' }}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                data.width = value;
                chart.patch();
              }
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
                chart.patch();
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
            inputProps={{ min: '0', step: '0.1' }}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                data.speed = value;
                chart.patch();
              }
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
                  chart.patch();
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

const MultiEdit = observer(() => {
  const [editWidth, setEditWidth] = React.useState(false);
  const [editSide, setEditSide] = React.useState(false);
  const [editSpeed, setEditSpeed] = React.useState(false);
  const [editIsFake, setEditIsFake] = React.useState(false);

  const sample = track.lineData!.noteList[[...track.selected.values()][0]];

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        {!editWidth ? (
          <Button
            color="primary"
            startIcon={<Edit />}
            onClick={() => setEditWidth(true)}
          >
            Width
          </Button>
        ) : (
          <TextField
            fullWidth
            label="Width"
            type="number"
            value={sample.width}
            inputProps={{ min: '0', step: '0.1' }}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                if (track.lineData) {
                  track.selected.forEach((idx) => {
                    track.lineData!.noteList[idx].width = value;
                  });
                  chart.patch();
                }
              }
            })}
          />
        )}
      </Grid>
      <Grid item>
        {!editSide ? (
          <Button
            color="primary"
            startIcon={<Edit />}
            onClick={() => setEditSide(true)}
          >
            Side
          </Button>
        ) : (
          <FormControl>
            <FormLabel>Side</FormLabel>
            <RadioGroup
              row
              value={sample.side}
              onChange={action((event) => {
                const side = parseInt(event.target.value) as NoteData['side'];
                if (track.lineData) {
                  track.selected.forEach((idx) => {
                    track.lineData!.noteList[idx].side = side;
                  });
                  chart.patch();
                }
              })}
            >
              <FormControlLabel value={1} label="1" control={<Radio />} />
              <FormControlLabel value={-1} label="-1" control={<Radio />} />
            </RadioGroup>
          </FormControl>
        )}
      </Grid>
      <Grid item>
        {!editSpeed ? (
          <Button
            color="primary"
            startIcon={<Edit />}
            onClick={() => setEditSpeed(true)}
          >
            Speed (factor)
          </Button>
        ) : (
          <TextField
            fullWidth
            label="Speed (factor)"
            type="number"
            value={sample.speed}
            inputProps={{ min: '0', step: '0.1' }}
            onChange={action((event) => {
              const value = parseFloat(event.target.value);
              if (Number.isFinite(value)) {
                if (track.lineData) {
                  track.selected.forEach((idx) => {
                    track.lineData!.noteList[idx].speed = value;
                  });
                  chart.patch();
                }
              }
            })}
          />
        )}
      </Grid>
      <Grid item>
        {!editIsFake ? (
          <Button
            color="primary"
            startIcon={<Edit />}
            onClick={() => setEditIsFake(true)}
          >
            Is fake
          </Button>
        ) : (
          <FormControlLabel
            label="Is fake"
            control={
              <Switch
                checked={sample.isFake}
                onChange={action((event) => {
                  const isFake = Boolean(event.target.value);
                  if (track.lineData) {
                    track.selected.forEach((idx) => {
                      track.lineData!.noteList[idx].isFake = isFake;
                    });
                    chart.patch();
                  }
                })}
              />
            }
          />
        )}
      </Grid>
    </Grid>
  );
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
    <Dialog onClose={onClose} open={open} fullWidth>
      <Box margin="15px">
        {track.selected.size === 1 ? <SingleEdit /> : <MultiEdit />}
      </Box>
    </Dialog>
  );
});
