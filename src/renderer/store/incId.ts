export interface IncId {
  (): number;
  get(): number;
  set(id: number): void;
}

export default function incId(): IncId {
  let nextId = 0;
  return Object.assign(
    () => {
      return nextId++;
    },
    {
      get() {
        return nextId;
      },
      set(id: number) {
        nextId = id;
      },
    }
  );
}
