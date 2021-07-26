import { makeAutoObservable } from 'mobx';
import type { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

interface Toast {
  message: SnackbarMessage;
  options?: OptionsObject;
}

class ToastManager {
  toasts: Toast[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  send(
    message: SnackbarMessage,
    options?: OptionsObject
  ): SnackbarKey | undefined {
    return this.toasts.push({ message, options });
  }
}

const toast = new ToastManager();

export default toast;
