import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  RadioGroup,
  Radio,
  Switch,
  Typography,
  Button,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { Redo, Undo, ZoomIn, ZoomOut } from '@material-ui/icons';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { chart } from '/@/managers';
import track, { ToolType } from './state';
import NoteEdit from './NoteEdit';

const SelectTool = observer(() => {
  const update = action((tool: ToolType) => {
    track.tool = tool;
    track.clear();
  });

  useHotkeys('1', () => update('cursor'));
  useHotkeys('2', () => update('note'));
  useHotkeys('3', () => update('prop'));

  return (
    <Grid item>
      <Box display="block" my={2} component={FormLabel}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>Tool</Grid>
        </Grid>
      </Box>
      <RadioGroup value={track.tool} onChange={(e, v) => update(v as ToolType)}>
        <FormControlLabel
          value="cursor"
          control={<Radio />}
          label="Cursor"
          title="Hotkey: 1"
        />
        <FormControlLabel
          value="note"
          control={<Radio />}
          label="Note"
          title="Hotkey: 2"
        />
        <FormControlLabel
          value="prop"
          control={<Radio />}
          label="Prop"
          title="Hotkey: 3"
        />
      </RadioGroup>
    </Grid>
  );
});

const Align = observer(() => {
  useHotkeys(
    'a',
    action(() => {
      track.align = !track.align;
    })
  );

  return (
    <FormControlLabel
      label="Align to guideline"
      control={
        <Switch
          checked={track.align}
          onChange={action((_, checked) => {
            track.align = checked;
          })}
        />
      }
    />
  );
});

const SelectDivisor = observer(() => {
  return (
    <Grid item>
      <FormControl fullWidth>
        <InputLabel>Grid divisor</InputLabel>
        <Select
          fullWidth
          value={track.division}
          onChange={action((e) => (track.division = e.target.value as number))}
        >
          <MenuItem value={1}>1 / 1</MenuItem>
          <MenuItem value={2}>1 / 2</MenuItem>
          <MenuItem value={3}>1 / 3</MenuItem>
          <MenuItem value={4}>1 / 4</MenuItem>
          <MenuItem value={6}>1 / 6</MenuItem>
          <MenuItem value={8}>1 / 8</MenuItem>
          <MenuItem value={16}>1 / 16</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
});

const GuidelineNum = observer(() => {
  return (
    <Grid item>
      <TextField
        fullWidth
        label="Number of Guidelines"
        value={track.guideline}
        type="number"
        onChange={action((e) => {
          const value = e.target.value;
          if (Number.isInteger(Number(value))) {
            track.guideline = Number(value);
          }
        })}
      />
    </Grid>
  );
});

const ZoomInOut = observer(() => {
  return (
    <Grid item container spacing={2} alignItems="center">
      <Grid item>
        <IconButton onClick={track.zoomin} disabled={track.zoom > 3.9}>
          <ZoomIn />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={track.zoomout} disabled={track.zoom < 0.3}>
          <ZoomOut />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography>{Math.round(track.zoom * 100)}%</Typography>
      </Grid>
    </Grid>
  );
});

const NoteEditButton = observer(() => {
  const [open, setOpen] = React.useState(false);

  useHotkeys('e', () => {
    if (track.selected.size !== 0) setOpen(true);
  });

  return (
    <>
      <Tooltip title="Hotkey: e">
        <span>
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            disabled={track.selected.size === 0}
          >
            Edit
          </Button>
        </span>
      </Tooltip>
      <NoteEdit open={open} onClose={() => setOpen(false)} />
    </>
  );
});

const UndoRedo = observer(() => {
  // The hotkey is global

  return (
    <Grid item container spacing={2} alignItems="center">
      <Grid item>
        <Tooltip title="Hotkey: ctrl+z">
          <span>
            <IconButton onClick={() => chart.undo()} disabled={!chart.canUndo}>
              <Undo />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Hotkey: ctrl+y">
          <span>
            <IconButton onClick={() => chart.redo()} disabled={!chart.canRedo}>
              <Redo />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  );
});

export default function Tools(): JSX.Element {
  return (
    <Box overflow="hidden" padding="10px">
      <Grid container spacing={2} direction="column">
        <SelectTool />
        <NoteEditButton />
        <Align />
        <SelectDivisor />
        <GuidelineNum />
        <ZoomInOut />
        <UndoRedo />
      </Grid>
    </Box>
  );
}
