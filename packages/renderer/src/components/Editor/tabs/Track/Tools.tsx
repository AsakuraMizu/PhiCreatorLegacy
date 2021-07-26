import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
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
  makeStyles,
} from '@material-ui/core';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  SelectAll as SelectAllIcon,
} from '@material-ui/icons';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import store from '/@/store';
import { blurActive } from '/@/common';
import NoteEdit from './NoteEdit';
import ContentCopyIcon from '/@/components/icons/ContentCopyIcon';
import MirrorIcon from '/@/components/icons/MirrorIcon';

const { track } = store.editor;

const SelectTool = observer(() => {
  const update = (tool: 'cursor' | 'note' | 'prop') => {
    blurActive();
    track.switchTool(tool);
  };

  useHotkeys('1', () => update('cursor'));
  useHotkeys('2', () => update('note'));
  useHotkeys('3', () => update('prop'));

  return (
    <RadioGroup
      value={track.tool}
      onChange={(e, v) => update(v as 'cursor' | 'note' | 'prop')}
    >
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
  );
});

const NoteEditButton = observer(() => {
  const [open, setOpen] = React.useState(false);

  useHotkeys('e', () => {
    if (track.selected.length !== 0) setOpen(true);
  });

  return (
    <>
      <Tooltip title="Hotkey: e">
        <span>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpen(true)}
            disabled={track.selected.length === 0}
          >
            Edit {track.selected.length > 1 && '(multiple)'}
          </Button>
        </span>
      </Tooltip>
      <NoteEdit open={open} onClose={() => setOpen(false)} />
    </>
  );
});

const Align = observer(() => {
  useHotkeys('a', () => {
    track.update({ align: !track.align });
  });

  return (
    <FormControlLabel
      label="Align to guideline"
      control={
        <Switch
          checked={track.align}
          onChange={(_, checked) => {
            blurActive();
            track.update({ align: checked });
          }}
        />
      }
    />
  );
});

const SelectDivisor = observer(() => (
  <FormControl fullWidth>
    <InputLabel>Grid divisor</InputLabel>
    <Select
      fullWidth
      value={track.division}
      onChange={(e) => track.setDivision(e.target.value as number)}
    >
      {track.divisions.map((d) => (
        <MenuItem key={d} value={d}>
          1 / {d}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));

const GuidelineNum = observer(() => (
  <TextField
    fullWidth
    label="Number of Guidelines"
    value={track.guideline}
    type="number"
    onChange={(e) => {
      const guideline = parseInt(e.target.value);
      if (Number.isFinite(guideline)) track.update({ guideline });
    }}
  />
));

const Copy = () => {
  useHotkeys('ctrl+c', () => track.copy());
  useHotkeys('ctrl+v', () => track.paste());

  return (
    <Tooltip title="Hotkey: ctrl+c">
      <IconButton onClick={() => track.copy()}>
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  );
};

const SelectAll = () => {
  useHotkeys('ctrl+a', (event) => {
    event.preventDefault();
    track.selectAll();
  });

  return (
    <Tooltip title="Hotkey: ctrl+a">
      <IconButton onClick={() => track.selectAll()}>
        <SelectAllIcon />
      </IconButton>
    </Tooltip>
  );
};

const Mirror = () => {
  useHotkeys('m', () => track.mirror());

  return (
    <Tooltip title="Hotkey: m">
      <IconButton onClick={() => track.mirror()}>
        <MirrorIcon />
      </IconButton>
    </Tooltip>
  );
};

const ZoomIn = observer(() => (
  <IconButton onClick={() => track.zoomin()} disabled={track.zoom > 3.9}>
    <ZoomInIcon />
  </IconButton>
));

const ZoomOut = observer(() => (
  <IconButton onClick={() => track.zoomout()} disabled={track.zoom < 0.3}>
    <ZoomOutIcon />
  </IconButton>
));

const Zoom = observer(() => (
  <Typography>{Math.round(track.zoom * 100)}%</Typography>
));

const Undo = observer(() => (
  <Tooltip title="Hotkey: ctrl+z">
    <span>
      <IconButton
        onClick={() => store.chart.history.undo()}
        disabled={!store.chart.history.canUndo}
      >
        <UndoIcon />
      </IconButton>
    </span>
  </Tooltip>
));

const Redo = observer(() => (
  <Tooltip title="Hotkey: ctrl+y">
    <span>
      <IconButton
        onClick={() => store.chart.history.redo()}
        disabled={!store.chart.history.canRedo}
      >
        <RedoIcon />
      </IconButton>
    </span>
  </Tooltip>
));

const useStyles = makeStyles(() => ({
  root: {
    overflowX: 'hidden',
    padding: '10px',
  },
}));

export default function Tools(): JSX.Element {
  const cn = useStyles();

  return (
    <Box className={cn.root}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <SelectTool />
        </Grid>
        <Grid item>
          <NoteEditButton />
        </Grid>
        <Align />
        <Grid item>
          <SelectDivisor />
        </Grid>
        <Grid item>
          <GuidelineNum />
        </Grid>
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <Copy />
          </Grid>
          <Grid item>
            <SelectAll />
          </Grid>
          <Grid item>
            <Mirror />
          </Grid>
          <Grid item>
            <Undo />
          </Grid>
          <Grid item>
            <Redo />
          </Grid>
        </Grid>
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <ZoomIn />
          </Grid>
          <Grid item>
            <ZoomOut />
          </Grid>
          <Grid item>
            <Zoom />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
