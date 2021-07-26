import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  AppBar,
  Box,
  Dialog,
  Grid,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import List from './List';
import Edit from './Edit';

export interface LinesProps {
  open: boolean;
  onClose: () => void;
}

export default observer(function Lines({ open, onClose }: LinesProps) {
  return (
    <Dialog onClose={onClose} open={open} fullScreen>
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box padding="10px">
        <Grid container spacing={3}>
          <List />
          <Edit />
        </Grid>
      </Box>
    </Dialog>
  );
});
