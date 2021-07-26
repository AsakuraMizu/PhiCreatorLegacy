import React from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog, Box } from '@material-ui/core';
import store from '/@/store';
import SingleNoteEdit from './SingleNoteEdit';
import MultiNoteEdit from './MultiNoteEdit';

export interface NoteEditProps {
  open: boolean;
  onClose: () => void;
}

export default observer(function NoteEdit({
  open,
  onClose,
}: NoteEditProps): JSX.Element {
  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <Box margin="15px">
        {store.editor.track.selected.length === 1 ? (
          <SingleNoteEdit data={store.editor.track.selected[0]} />
        ) : (
          <MultiNoteEdit data={store.editor.track.selected} />
        )}
      </Box>
    </Dialog>
  );
});
