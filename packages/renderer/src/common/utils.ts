export function blurActive(): void {
  (document.activeElement as HTMLElement)?.blur?.();
}

export function fixer(x: number): number {
  return Math.round(x * 1e8) / 1e8;
}

export function pround(x: number, precision: number): number {
  return fixer(Math.round(x / precision) * precision);
}

export function pfloor(x: number, precision: number): number {
  return fixer(Math.floor(x / precision) * precision);
}

export function pceil(x: number, precision: number): number {
  return fixer(Math.ceil(x / precision) * precision);
}

export function getIndex<EU, TU>(
  pool: EU[],
  target: TU,
  cmp: (target: TU, element: EU) => boolean
): number {
  let l = -1;
  let r = pool.length;
  while (r - l > 1) {
    const m = Math.floor((l + r) / 2);
    if (cmp(target, pool[m])) {
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
  return await toBase64(new Blob([await api.project.readFile(path)]));
}
