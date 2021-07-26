import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles, Box, Tab, Tabs, Fade } from '@material-ui/core';
import SideBar from './SideBar';
import tabs, { TabKeys } from './tabs';
import store from '/@/store';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  left: {
    width: '20%',
  },
  right: {
    width: '80%',
  },
}));

export default observer(function Editor() {
  const cn = useStyles();

  return (
    <Box className={cn.root}>
      <Box className={cn.left}>
        <SideBar />
      </Box>
      <Box className={cn.right}>
        <Tabs
          value={store.editor.tab}
          scrollButtons="auto"
          onChange={(_, tab) => {
            store.editor.switchTab(tab);
          }}
        >
          {Object.entries(tabs).map(([key, tab]) => (
            <Tab key={key} label={tab.name} />
          ))}
        </Tabs>
        <Fade in key={store.editor.tab}>
          <Box>{tabs[store.editor.tab as TabKeys].main}</Box>
        </Fade>
      </Box>
    </Box>
  );
});
