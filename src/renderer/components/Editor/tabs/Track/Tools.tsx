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
} from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import track, { ToolType } from './state';
import NoteEdit from './NoteEdit';

const SelectTool = observer(() => {
  const update = action((tool: ToolType) => {
    track.tool = tool;
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
        <FormControlLabel value="cursor" control={<Radio />} label="Cursor" />
        <FormControlLabel value="note" control={<Radio />} label="Note" />
        <FormControlLabel value="prop" control={<Radio />} label="Prop" />
      </RadioGroup>
    </Grid>
  );
});

const Align = observer(() => {
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

  return (
    <>
      {track.selected.size !== 0 && (
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Edit
        </Button>
      )}
      <NoteEdit open={open} onClose={() => setOpen(false)} />
    </>
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
      </Grid>
    </Box>
  );
}
