export function pround(x: number, precision: number): number {
  return Math.round(x / precision) * precision;
}

export function pfloor(x: number, precision: number): number {
  return Math.floor(x / precision) * precision;
}

export function pceil(x: number, precision: number): number {
  return Math.ceil(x / precision) * precision;
}

export function search(list: { time: number }[], time: number): number {
  let l = -1;
  let r = list.length;
  while (r - l > 1) {
    const m = Math.floor((l + r) / 2);
    if (time - list[m].time < 1e-5) {
      r = m;
    } else {
      l = m;
    }
  }
  return l;
}

export async function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => resolve(<string>reader.result));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(blob);
  });
}

export async function file2url(path: string): Promise<string> {
  return await toBase64(new Blob([await api.readFile(path)]));
}
