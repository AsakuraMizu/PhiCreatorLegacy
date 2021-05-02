import React from 'react';
import { observer } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { timing } from '/@/managers';
import { pround } from '/@/common';
import store from '/@/store';
import SingleBpm from '/@/store/chart/bpm';

const useStyles = makeStyles({
  table: {
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  tablerow: {
    cursor: 'pointer',
  },
});

const BpmRow = observer(function ({
  data,
}: {
  data: Instance<typeof SingleBpm>;
}) {
  const cn = useStyles();

  return (
    <TableRow
      className={cn.tablerow}
      selected={
        store.editor.timing.selectedBpm &&
        data === store.editor.timing.selectedBpm
      }
      hover
      onClick={() => {
        store.editor.timing.setSelectedBpm(data);
      }}
    >
      <TableCell>{data.id}</TableCell>
      <TableCell>{data.time}</TableCell>
      <TableCell>{data.bpm}</TableCell>
    </TableRow>
  );
});

const AddBtn = () => (
  <Button
    color="primary"
    onClick={() => {
      store.chart.addBpm({
        time: pround(timing.tick, 1),
        bpm: 175,
      });
    }}
  >
    Add
  </Button>
);

const RemoveBtn = observer(() => (
  <Button
    color="secondary"
    disabled={store.editor.timing.selectedBpm === undefined}
    onClick={() => {
      if (store.editor.timing.selectedBpm) {
        store.chart.removeBpm(store.editor.timing.selectedBpm);
      }
    }}
  >
    Remove
  </Button>
));

export default observer(function List() {
  const cn = useStyles();

  return (
    <Grid item container xs={12} sm spacing={2} direction="column">
      <Grid item className={cn.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Bpm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.chart.bpmList.map((b) => (
              <BpmRow key={b.id} data={b} />
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item>
        <AddBtn />
        <RemoveBtn />
      </Grid>
    </Grid>
  );
});
