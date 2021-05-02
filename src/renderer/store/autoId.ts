export default class AutoId {
  nextId = 0;

  next(): number {
    return this.nextId++;
  }

  update(id: number): void {
    this.nextId = Math.max(this.nextId, id + 1);
  }
}
