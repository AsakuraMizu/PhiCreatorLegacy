/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  AppBar,
  Box,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import { maxBy } from 'lodash-es';
import { easingNames, Props } from '/@/common';
import { chart } from '/@/managers';
import track, { props } from './state';

const SingleProp = observer(({ prop }: { prop: Props }) => {
  const data = track.propData.get(track.startTime);

  return (
    <Grid item container alignItems="center">
      <Grid item xs={3}>
        <Typography>{prop}</Typography>
      </Grid>
      {data?.[prop] ? (
        <>
          <Grid item xs={4}>
            <TextField
              label="Value"
              type="number"
              value={data[prop]?.value}
              inputProps={{ step: '0.1' }}
              onChange={action((event) => {
                const value = parseFloat(event.target.value);
                if (Number.isFinite(value)) {
                  data[prop]!.value = value;
                  chart.patch();
                }
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel>Easing</InputLabel>
              <Select
                value={data[prop]?.easing ?? 0}
                onChange={action((event) => {
                  data[prop]!.easing = event.target.value as number;
                  chart.patch();
                })}
              >
                {easingNames.map((name, index) => (
                  <MenuItem key={index} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton
              onClick={action(() => {
                const list = track.lineData?.props[prop];
                const idx = list?.findIndex(
                  (state) => state.time === track.startTime
                );
                if (idx) {
                  list?.splice(idx, 1);
                  chart.patch();
                }
              })}
            >
              <Close />
            </IconButton>
          </Grid>
        </>
      ) : (
        <Grid item>
          <IconButton
            onClick={action(() => {
              const id = maxBy(track.lineData?.props[prop], 'id')?.id ?? -1;
              track.lineData?.props[prop].push({
                id: id + 1,
                time: track.startTime,
                value: 0,
              });
              chart.patch();
            })}
          >
            <Add />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
});

export interface PropEditProps {
  open: boolean;
  onClose: () => void;
}

export default observer(function PropEdit({
  open,
  onClose,
}: PropEditProps): JSX.Element {
  return (
    <Dialog onClose={onClose} open={open} fullScreen>
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box margin="10px">
        <Grid container direction="column" spacing={3}>
          {props.map((prop) => (
            <SingleProp key={prop} prop={prop} />
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
});
