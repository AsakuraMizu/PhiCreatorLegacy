import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
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
import { chart } from '/@/managers';
import editor from '../../state';

const useStyles = makeStyles({
  tablerow: {
    cursor: 'pointer',
  },
});

export default observer(function Left() {
  const cn = useStyles();

  return (
    <Grid item container xs={12} sm spacing={2} direction="column">
      <Grid item>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Construct Time</TableCell>
              <TableCell>Destruct Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chart.data?.judgeLineList.map((l, i) => (
              <TableRow
                key={l.id}
                className={cn.tablerow}
                selected={i === editor.line}
                hover
                onClick={action(() => {
                  editor.line = i;
                })}
              >
                <TableCell>{l.id}</TableCell>
                <TableCell>{l.name}</TableCell>
                <TableCell>{l.constructTime}</TableCell>
                <TableCell>{l.destructTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item>
        <Button
          color="primary"
          onClick={action(() => {
            if (chart.data) {
              chart.data.judgeLineList.push({
                id: editor.lastId + 1,
                constructTime: 0,
                destructTime: 4800,
                noteList: [],
                props: {
                  controlX: [{ id: 0, time: 0, value: 0 }],
                  controlY: [{ id: 0, time: 0, value: 0 }],
                  angle: [{ id: 0, time: 0, value: 0 }],
                  speed: [{ id: 0, time: 0, value: 1 }],
                  noteAlpha: [{ id: 0, time: 0, value: 1 }],
                  lineAlpha: [{ id: 0, time: 0, value: 1 }],
                  displayRange: [{ id: 0, time: 0, value: -1 }],
                },
              });
              editor.line = chart.data.judgeLineList.length - 1;
            }
          })}
        >
          Add
        </Button>
        <Button
          color="secondary"
          onClick={action(() => {
            if (chart.data) {
              chart.data.judgeLineList.splice(editor.line, 1);
              editor.line = chart.data.judgeLineList.length - 1;
            }
          })}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  );
});
