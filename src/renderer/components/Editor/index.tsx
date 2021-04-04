import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { makeStyles, Box, Tab, Tabs, Fade } from '@material-ui/core';
import SideBar from './SideBar';
import editor from './state';
import tabs from './tabs';

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
          value={editor.tab}
          scrollButtons="auto"
          onChange={action((_, tab) => {
            editor.tab = tab;
          })}
        >
          {Object.entries(tabs).map(([key, tab]) => (
            <Tab key={key} label={tab.name} />
          ))}
        </Tabs>
        <Fade in key={editor.tab}>
          <Box>{tabs[editor.tab].main}</Box>
        </Fade>
      </Box>
    </Box>
  );
});
