import React from 'react';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
// import { chart, control } from '/@/managers';
import editor from '../state';
import tabs from '../tabs';
// import Viewer from './Viewer';
import Lines from './Lines';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

export default observer(function SideBar() {
  const cn = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Box className={cn.root}>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={9}>
          <FormControl fullWidth>
            <Select
              value={editor.line}
              onChange={action((event) => {
                editor.line = event.target.value as number;
              })}
            >
              {chart.data?.judgeLineList.map((l, index) => (
                <MenuItem key={index} value={index}>
                  {l.name ?? ''}#{l.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setOpen(true)}>
            <Edit />
          </IconButton>
        </Grid>
      </Grid>
      <Lines open={open} onClose={() => setOpen(false)} />
      {tabs[editor.tab].tools}
      {/* <Box marginTop="auto">{control.live && <Viewer />}</Box> */}
    </Box>
  );
});
