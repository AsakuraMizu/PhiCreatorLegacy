import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';
import toast from '/@/managers/toast';

export default observer(function Toast() {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() =>
    reaction(
      () => [...toast.toasts],
      () => {
        while (toast.toasts.length > 0) {
          const t = toast.toasts.shift();
          if (t) {
            const { message, options } = t;
            enqueueSnackbar(message, options);
          }
        }
      }
    )
  );

  return <></>;
});
