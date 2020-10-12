// based on https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts

import { Ease } from './ChartData';

const pow = Math.pow;
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
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
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
    return 1 - pow(1 - x, 3);
  },
  easeInQuart(x: number) {
    return x * x * x * x;
  },
  easeOutQuart(x: number) {
    return 1 - pow(1 - x, 4);
  },
  easeInQuint(x: number) {
    return x * x * x * x * x;
  },
  easeOutQuint(x: number) {
    return 1 - pow(1 - x, 5);
  },
  easeInSine(x: number) {
    return 1 - cos((x * PI) / 2);
  },
  easeOutSine(x: number) {
    return sin((x * PI) / 2);
  },
  easeInExpo(x: number) {
    return x === 0 ? 0 : pow(2, 10 * x - 10);
  },
  easeOutExpo(x: number) {
    return x === 1 ? 1 : 1 - pow(2, -10 * x);
  },
  easeInCirc(x: number) {
    return 1 - sqrt(1 - pow(x, 2));
  },
  easeOutCirc(x: number) {
    return sqrt(1 - pow(x - 1, 2));
  },
  easeInBack(x: number) {
    return c3 * x * x * x - c1 * x * x;
  },
  easeOutBack(x: number) {
    return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
  },
  easeInElastic(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
  },
  easeOutElastic(x: number) {
    return x === 0
      ? 0
      : x === 1
      ? 1
      : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
  },
  easeInBounce(x: number) {
    return 1 - bounceOut(1 - x);
  },
  easeOutBounce: bounceOut,
};

export default function EaseCalc(l: number, r: number, t: number, ease?: Ease) {
  let func: (t: number) => number;
  switch (ease) {
    case 'backIn':
      func = easingsFunctions.easeInBack;
      break;
    case 'backOut':
      func = easingsFunctions.easeOutBack;
      break;
    case 'bounceIn':
      func = easingsFunctions.easeInBounce;
      break;
    case 'bounceOut':
      func = easingsFunctions.easeOutBounce;
      break;
    case 'circIn':
      func = easingsFunctions.easeInCirc;
      break;
    case 'circOut':
      func = easingsFunctions.easeOutCirc;
      break;
    case 'cubicIn':
      func = easingsFunctions.easeInCubic;
      break;
    case 'cubicOut':
      func = easingsFunctions.easeOutCubic;
      break;
    case 'elasticIn':
      func = easingsFunctions.easeInElastic;
      break;
    case 'elasticOut':
      func = easingsFunctions.easeOutElastic;
      break;
    case 'expoIn':
      func = easingsFunctions.easeInExpo;
      break;
    case 'expoOut':
      func = easingsFunctions.easeOutExpo;
      break;
    case 'quadIn':
      func = easingsFunctions.easeInQuad;
      break;
    case 'quadOut':
      func = easingsFunctions.easeOutQuad;
      break;
    case 'quartIn':
      func = easingsFunctions.easeInQuart;
      break;
    case 'quartOut':
      func = easingsFunctions.easeOutQuart;
      break;
    case 'quintIn':
      func = easingsFunctions.easeInQuint;
      break;
    case 'quintOut':
      func = easingsFunctions.easeOutQuint;
      break;
    case 'sineIn':
      func = easingsFunctions.easeInSine;
      break;
    case 'sineOut':
      func = easingsFunctions.easeOutSine;
      break;
    case 'linear':
    default:
      func = t => t;
      break;
  }
  return l + (r - l) * func(t);
}
