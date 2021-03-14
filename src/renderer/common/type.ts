export type RPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? RPartial<U>[] // eslint-disable-next-line @typescript-eslint/ban-types
    : T[K] extends object
    ? RPartial<T[K]>
    : T[K];
};
