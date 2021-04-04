/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { cloneDeep } from 'lodash';
import hash from 'object-hash';

export function diffClone(origin, data) {
  switch (typeof origin) {
    case 'object':
      if (Array.isArray(origin)) {
        const rtn = [];
        const hashes = new Map();
        origin.forEach((value, index) => {
          hashes.set(hash(value), index);
        });
        if (origin.length === data.length) {
          data.forEach((value, index) => {
            const idx = hashes.get(hash(value));
            if (idx) {
              rtn.push(origin[idx]);
            } else {
              rtn.push(diffClone(origin[index], data[index]));
            }
          });
        } else {
          data.forEach((value) => {
            const idx = hashes.get(hash(value));
            if (idx) {
              rtn.push(origin[idx]);
            } else {
              rtn.push(cloneDeep(value));
            }
          });
        }
        return rtn;
      } else {
        const rtn = {};
        Object.keys(data).forEach((key) => {
          if (hash(origin[key]) === hash(data[key])) {
            rtn[key] = origin[key];
          } else if (key in origin) {
            rtn[key] = diffClone(origin[key], data[key]);
          } else {
            rtn[key] = cloneDeep(data[key]);
          }
        });
        return rtn;
      }
    default:
      return data;
  }
}
