import { applyOperation, deepClone, getValueByPointer } from 'fast-json-patch';
import type { Patch } from './type';

export function superPatch<T>(
  document: T,
  patch: Patch
): { newDocument: T; rev: Patch } {
  const rev: Patch = [];
  let newDocument = deepClone(document);
  patch.forEach((op) => {
    let value;
    let rp = op.path;
    const parentPath = op.path.substr(0, op.path.lastIndexOf('/'));
    const parent = getValueByPointer(newDocument, parentPath);
    if (Array.isArray(parent)) {
      if (op.path.endsWith('-')) rp = `${parentPath}/${parent.length}`;
    } else value = getValueByPointer(newDocument, op.path);
    if ((op.op === 'add' && value === undefined) || op.op === 'copy') {
      if (op.path !== rp) {
        rev.push({ op: 'remove', path: rp });
      } else rev.push({ op: 'remove', path: op.path });
    } else if (op.op === 'add' || op.op === 'remove')
      rev.push({ op: 'add', path: op.path, value });
    else if (op.op === 'move') {
      rev.push({ op: 'move', from: rp, path: op.from });
      if (value) {
        rev.push({ op: 'add', path: op.path, value });
      }
    } else if (op.op === 'replace')
      rev.push({ op: 'replace', path: op.path, value });
    else rev.push(op);
    newDocument = applyOperation(newDocument, op, false, true).newDocument;
  });
  rev.reverse();
  return { newDocument, rev };
}
