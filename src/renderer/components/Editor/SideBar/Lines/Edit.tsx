import React from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, TextField } from '@material-ui/core';
import store from '/@/store';

const IDField = observer(() => (
  <TextField
    fullWidth
    label="ID"
    type="number"
    disabled
    value={store.editor.line?.id ?? -1}
  />
));

const NameField = observer(() => (
  <TextField
    fullWidth
    label="Name"
    disabled={store.editor.line === undefined}
    value={store.editor.line?.name ?? ''}
    onChange={(event) => {
      store.editor.line?.update({ name: event.target.value });
    }}
  />
));

export default function Edit(): JSX.Element {
  return (
    <Grid item xs={12} sm container spacing={2} direction="column">
      <Grid item>
        <IDField />
      </Grid>
      <Grid item>
        <NameField />
      </Grid>
    </Grid>
  );
}
