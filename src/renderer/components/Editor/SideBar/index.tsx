import React from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import { chart } from '/@/managers';
import editor from '../state';
import tabs from '../tabs';
import Viewer from './Viewer';
import Lines from './Lines';
import { observer } from 'mobx-react-lite';

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

  const data = chart.data?.judgeLineList[editor.line];

  return (
    <Box className={cn.root}>
      <Button onClick={() => setOpen(true)}>
        {data?.name ?? ''}#{data?.id}
      </Button>
      <Lines open={open} onClose={() => setOpen(false)} />
      {tabs[editor.tab].tools}
      <Box marginTop="auto">
        <Viewer />
      </Box>
    </Box>
  );
});
