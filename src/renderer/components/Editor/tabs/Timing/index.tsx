import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Box, Grid, makeStyles, TextField } from '@material-ui/core';
import { chart } from '/@/managers';
import List from './List';
import Edit from './Edit';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 1000,
  },
});

const MusicOffset = observer(() => {
  return (
    <Grid item>
      <TextField
        fullWidth
        label="Music Offset (ms)"
        type="number"
        value={chart.data?.musicOffset}
        onChange={action((event) => {
          if (chart.data)
            chart.data.musicOffset = parseFloat(event.target.value);
        })}
      />
    </Grid>
  );
});

export default function Timing(): JSX.Element {
  const cn = useStyles();

  return (
    <Box margin="20px">
      <Grid className={cn.root} container spacing={2} direction="column">
        <MusicOffset />
        <Grid item container spacing={3}>
          <List />
          <Edit />
        </Grid>
      </Grid>
    </Box>
  );
}
