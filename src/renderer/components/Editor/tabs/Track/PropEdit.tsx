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
import { Easing, Props } from '/@/common';
import track, { props } from './state';

const SingleProp = observer(({ prop }: { prop: Props }) => {
  const data = track.propData.get(track.editingTime);

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
              onChange={action((event) => {
                data[prop]!.value = parseFloat(event.target.value);
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel>Easing</InputLabel>
              <Select
                value={data[prop]?.easing ?? 'none'}
                onChange={action((event) => {
                  data[prop]!.easing = event.target.value as Easing;
                })}
              >
                <MenuItem value="easeInBack">easeInBack</MenuItem>
                <MenuItem value="easeInBounce">easeInBounce</MenuItem>
                <MenuItem value="easeInCirc">easeInCirc</MenuItem>
                <MenuItem value="easeInCubic">easeInCubic</MenuItem>
                <MenuItem value="easeInElastic">easeInElastic</MenuItem>
                <MenuItem value="easeInExpo">easeInExpo</MenuItem>
                <MenuItem value="easeInOutBack">easeInOutBack</MenuItem>
                <MenuItem value="easeInOutBounce">easeInOutBounce</MenuItem>
                <MenuItem value="easeInOutCirc">easeInOutCirc</MenuItem>
                <MenuItem value="easeInOutCubic">easeInOutCubic</MenuItem>
                <MenuItem value="easeInOutElastic">easeInOutElastic</MenuItem>
                <MenuItem value="easeInOutExpo">easeInOutExpo</MenuItem>
                <MenuItem value="easeInOutQuad">easeInOutQuad</MenuItem>
                <MenuItem value="easeInOutQuart">easeInOutQuart</MenuItem>
                <MenuItem value="easeInOutQuint">easeInOutQuint</MenuItem>
                <MenuItem value="easeInOutSine">easeInOutSine</MenuItem>
                <MenuItem value="easeInQuad">easeInQuad</MenuItem>
                <MenuItem value="easeInQuart">easeInQuart</MenuItem>
                <MenuItem value="easeInQuint">easeInQuint</MenuItem>
                <MenuItem value="easeInSine">easeInSine</MenuItem>
                <MenuItem value="easeOutBack">easeOutBack</MenuItem>
                <MenuItem value="easeOutBounce">easeOutBounce</MenuItem>
                <MenuItem value="easeOutCirc">easeOutCirc</MenuItem>
                <MenuItem value="easeOutCubic">easeOutCubic</MenuItem>
                <MenuItem value="easeOutElastic">easeOutElastic</MenuItem>
                <MenuItem value="easeOutExpo">easeOutExpo</MenuItem>
                <MenuItem value="easeOutQuad">easeOutQuad</MenuItem>
                <MenuItem value="easeOutQuart">easeOutQuart</MenuItem>
                <MenuItem value="easeOutQuint">easeOutQuint</MenuItem>
                <MenuItem value="easeOutSine">easeOutSine</MenuItem>
                <MenuItem value="linear">linear</MenuItem>
                <MenuItem value="none">none</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton
              onClick={action(() => {
                const list = track.lineData?.props[prop];
                const idx = list?.findIndex(
                  (state) => state.time === track.editingTime
                );
                if (idx) list?.splice(idx, 1);
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
                time: track.editingTime,
                value: 0,
              });
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
