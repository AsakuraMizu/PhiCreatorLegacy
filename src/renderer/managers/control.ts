import { makeAutoObservable } from 'mobx';

class ControlManager {
  full = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleFull() {
    this.full = !this.full;
  }
}

const control = new ControlManager();

export default control;
