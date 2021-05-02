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
import store from '/@/store';
import SingleJudgeLine from '/@/store/chart/judgeline';

const useStyles = makeStyles({
  table: {
    maxHeight: '75vh',
    overflowY: 'auto',
  },
  tablerow: {
    cursor: 'pointer',
  },
});

const LineRow = observer(function ({
  data,
}: {
  data: Instance<typeof SingleJudgeLine>;
}) {
  const cn = useStyles();

  return (
    <TableRow
      className={cn.tablerow}
      selected={store.editor.line && data === store.editor.line}
      hover
      onClick={() => {
        store.editor.setCurrentLine(data);
      }}
    >
      <TableCell>{data.id}</TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.noteList.length}</TableCell>
    </TableRow>
  );
});

const AddBtn = () => (
  <Button
    color="primary"
    onClick={() => {
      store.editor.setCurrentLine(store.chart.addJudgeLine({}));
    }}
  >
    Add
  </Button>
);

const RemoveBtn = observer(() => (
  <Button
    color="secondary"
    disabled={store.editor.line === undefined}
    onClick={() => {
      if (store.editor.line) {
        store.chart.removeJudgeLine(store.editor.line);
      }
    }}
  >
    Remove
  </Button>
));

const CopyBtn = observer(() => (
  <Button
    disabled={store.editor.line === undefined}
    onClick={() => {
      if (store.editor.line) {
        store.editor.setCurrentLine(
          store.chart.addJudgeLine(store.editor.line.clone())
        );
      }
    }}
  >
    Copy
  </Button>
));

export default observer(function Left() {
  const cn = useStyles();

  return (
    <Grid item container xs={12} sm spacing={2} direction="column">
      <Grid item className={cn.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Note Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.chart.judgeLineList.map((l) => (
              <LineRow key={l.id} data={l} />
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item>
        <AddBtn />
        <RemoveBtn />
        <CopyBtn />
      </Grid>
    </Grid>
  );
});
