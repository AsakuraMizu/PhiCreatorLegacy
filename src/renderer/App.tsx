import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  makeStyles,
  Box,
  CssBaseline,
  Fade,
  ThemeProvider,
} from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { control, project } from './managers';
import Hotkeys from './components/Hotkeys';
import Toast from './components/Toast';
import Editor from './components/Editor';
// import FullViewer from './components/FullViewer';
import FooterBar from './components/FooterBar';
import theme from './theme';
import Preview from './components/Preview';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
  },
}));

export default observer(function App() {
  const cn = useStyles();

  React.useEffect(() => {
    api.project
      .openProject('/home/waterl/dasein')
      .then(() => project.reload(false, true))
      .then(() => project.mark(false));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <Hotkeys />
        <Toast />
        <Fade in>
          <Box className={cn.root}>
            {control.full ? (
              <Preview full />
            ) : (
              <>
                <Editor />
                <Box className={cn.bar}>
                  <FooterBar />
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </SnackbarProvider>
    </ThemeProvider>
  );
});
