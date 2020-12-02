import { writable, Writable } from 'svelte/store';
import { getBase64 } from '../shared/utils';

export function local<T>(name: string, value: T, check?: (value: T) => T): Writable<T> {
  if (localStorage.getItem(name)) {
    try {
      value = JSON.parse(localStorage.getItem(name));
    } catch {
      localStorage.removeItem(name);
    }
    value = check?.(value) ?? value;
  }
  const store = writable(value);
  store.subscribe($value => {
    const json = JSON.stringify($value) ?? JSON.stringify(value);
    localStorage.setItem(name, json);
  })
  return store;
}

export function file(): Writable<string> & { from: (value: File) => void } {
  const { subscribe, set, update } = writable('');
  return {
    subscribe,
    set,
    update,
    from: async (value: File) => {
      set(await getBase64(value));
    },
  }
}
