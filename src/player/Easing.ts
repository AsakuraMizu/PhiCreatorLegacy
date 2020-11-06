// based on https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts

import { Ease } from './ChartData';

const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const c1 = 1.70158;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;

function bounceOut(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  }

  if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  }

  if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  }

  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

const easingsFunctions = {
  easeInQuad(x: number) {
    return x * x;
  },
  easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x);
  },
  easeInCubic(x: number) {
    return x * x * x;
  },
  easeOutCubic(x: number) {
    return 1 - (1 - x) ** 3;
  },
  easeInQuart(x: number) {
    return x * x * x * x;
  },
  easeOutQuart(x: number) {
    return 1 - (1 - x) ** 4;
  },
  easeInQuint(x: number) {
    return x * x * x * x * x;
  },
  easeOutQuint(x: number) {
    return 1 - (1 - x) ** 5;
  },
  easeInSine(x: number) {
    return 1 - cos((x * PI) / 2);
  },
  easeOutSine(x: number) {
    return sin((x * PI) / 2);
  },
  easeInExpo(x: number) {
    return x === 0 ? 0 : 2 ** (10 * x - 10);
  },
  easeOutExpo(x: number) {
    return x === 1 ? 1 : 1 - 2 ** (-10 * x);
  },
  easeInCirc(x: number) {
    return 1 - sqrt(1 - x ** 2);
  },
  easeOutCirc(x: number) {
    return sqrt(1 - (x - 1) ** 2);
  },
  easeInBack(x: number) {
    return c3 * x * x * x - c1 * x * x;
  },
  easeOutBack(x: number) {
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
  },
  easeInElastic(x: number) {
    return x === 0 ?
      0 :
      (x === 1 ?
        1 :
        -(2 ** (10 * x - 10)) * sin((x * 10 - 10.75) * c4));
  },
  easeOutElastic(x: number) {
    return x === 0 ?
      0 :
      (x === 1 ?
        1 :
        2 ** (-10 * x) * sin((x * 10 - 0.75) * c4) + 1);
  },
  easeInBounce(x: number) {
    return 1 - bounceOut(1 - x);
  },
  easeOutBounce: bounceOut,
};

// eslint-disable-next-line complexity
export function easeCalc(l: number, r: number, t: number, ease?: Ease): number {
  let function_: (t: number) => number;
  switch (ease) {
    case 'backIn':
      function_ = easingsFunctions.easeInBack;
      break;
    case 'backOut':
      function_ = easingsFunctions.easeOutBack;
      break;
    case 'bounceIn':
      function_ = easingsFunctions.easeInBounce;
      break;
    case 'bounceOut':
      function_ = easingsFunctions.easeOutBounce;
      break;
    case 'circIn':
      function_ = easingsFunctions.easeInCirc;
      break;
    case 'circOut':
      function_ = easingsFunctions.easeOutCirc;
      break;
    case 'cubicIn':
      function_ = easingsFunctions.easeInCubic;
      break;
    case 'cubicOut':
      function_ = easingsFunctions.easeOutCubic;
      break;
    case 'elasticIn':
      function_ = easingsFunctions.easeInElastic;
      break;
    case 'elasticOut':
      function_ = easingsFunctions.easeOutElastic;
      break;
    case 'expoIn':
      function_ = easingsFunctions.easeInExpo;
      break;
    case 'expoOut':
      function_ = easingsFunctions.easeOutExpo;
      break;
    case 'quadIn':
      function_ = easingsFunctions.easeInQuad;
      break;
    case 'quadOut':
      function_ = easingsFunctions.easeOutQuad;
      break;
    case 'quartIn':
      function_ = easingsFunctions.easeInQuart;
      break;
    case 'quartOut':
      function_ = easingsFunctions.easeOutQuart;
      break;
    case 'quintIn':
      function_ = easingsFunctions.easeInQuint;
      break;
    case 'quintOut':
      function_ = easingsFunctions.easeOutQuint;
      break;
    case 'sineIn':
      function_ = easingsFunctions.easeInSine;
      break;
    case 'sineOut':
      function_ = easingsFunctions.easeOutSine;
      break;
    case 'jump':
      function_ = () => 1;
      break;
    case 'linear':
    default:
      function_ = t => t;
      break;
  }

  return l + (r - l) * function_(t);
}

// eslint-disable-next-line max-params
export function easeSumCalc(l: number, r: number, st: number, et: number, ease?: Ease): number {
  const eps = 1e-3;
  let t = st;
  let sum = 0;
  while (Math.abs(et - t) >= eps) {
    sum += easeCalc(l, r, t, ease);
    t += eps;
  }

  sum *= eps;
  return sum;
}
