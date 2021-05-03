import React from 'react';
import { observer } from 'mobx-react-lite';
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
import { control } from '/@/managers';
import store from '/@/store';
import tabs, { TabKeys } from '../tabs';
import Lines from './Lines';
import Preview from '../../Preview';

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
              value={store.editor.line?.id ?? ''}
              onChange={(event) => {
                store.editor.setCurrentLine(event.target.value as number);
              }}
            >
              {store.chart.judgeLineList.map((l) => (
                <MenuItem key={l.id} value={l.id}>
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
      {tabs[store.editor.tab as TabKeys].tools}
      <Box marginTop="auto">
        <Preview full={control.full} />
      </Box>
    </Box>
  );
});
