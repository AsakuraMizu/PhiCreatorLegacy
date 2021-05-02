import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Box,
  Button,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import { easingNames } from '/@/common';
import { Props, props } from '/@/common';
import store from '/@/store';

interface SinglePropLocalStateData {
  edit: boolean;
  value: number;
  easing: number;
}

interface SinglePropLocalState extends SinglePropLocalStateData {
  update(data: Partial<SinglePropLocalStateData>): void;
}

interface FieldProp {
  state: SinglePropLocalState;
}

const SinglePropValueField = observer(({ state }: FieldProp) => (
  <TextField
    label="Value"
    type="number"
    value={state.value}
    inputProps={{ step: '0.1' }}
    onChange={(event) => {
      const value = parseFloat(event.target.value);
      if (Number.isFinite(value)) state.update({ value });
    }}
  />
));

const SinglePropEasingField = observer(({ state }: FieldProp) => (
  <FormControl fullWidth>
    <InputLabel>Easing</InputLabel>
    <Select
      value={state.easing}
      onChange={(event) => {
        const easing = event.target.value as number;
        state.update({ easing });
      }}
    >
      {easingNames.map((name, index) => (
        <MenuItem key={index} value={index}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));

const SingleProp = observer(
  ({
    prop,
    addApply,
  }: {
    prop: Props;
    addApply: (func: () => void) => void;
  }) => {
    const data = store.editor.line!.props[prop];
    const { startTime } = store.editor.track;
    const state: SinglePropLocalState = useLocalObservable(() =>
      data.map.has(startTime)
        ? {
            edit: true,
            value: data.map.get(startTime)!.value,
            easing: data.map.get(startTime)!.easing,
            update(data) {
              Object.assign(this, data);
            },
          }
        : {
            edit: false,
            value: 0,
            easing: 0,
            update(data) {
              Object.assign(this, data);
            },
          }
    );
    React.useEffect(
      () =>
        addApply(() => {
          if (data.map.has(startTime)) {
            if (state.edit) {
              data.map
                .get(startTime)!
                .update({ value: state.value, easing: state.easing });
            } else {
              data.remove(startTime);
            }
          } else if (state.edit) {
            data.add({
              time: startTime,
              value: state.value,
              easing: state.easing,
            });
          }
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <Grid item container alignItems="center" spacing={3}>
        <Grid item xs={3}>
          <Typography>{prop}</Typography>
        </Grid>
        {state.edit ? (
          <>
            <Grid item xs={3}>
              <SinglePropValueField state={state} />
            </Grid>
            <Grid item xs={3}>
              <SinglePropEasingField state={state} />
            </Grid>
            <Grid item>
              <IconButton
                onClick={() =>
                  state.update({ edit: false, value: 0, easing: 0 })
                }
              >
                <Close />
              </IconButton>
            </Grid>
          </>
        ) : (
          <Grid item>
            <IconButton onClick={() => state.update({ edit: true })}>
              <Add />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  }
);

export default observer(function PropEdit() {
  const funcs: (() => void)[] = [];
  const addApply = (func: () => void) => funcs.push(func);
  const close = () => store.editor.track.update({ editingProp: false });
  const apply = () => funcs.forEach((func) => func());

  return (
    <Dialog onClose={close} open={store.editor.track.editingProp} fullWidth>
      <Box margin="25px">
        <Grid container direction="column" spacing={3}>
          {props.map((prop) => (
            <SingleProp key={prop} prop={prop} addApply={addApply} />
          ))}
          <Grid item>
            <Button variant="outlined" color="primary" onClick={apply}>
              Apply
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
});
