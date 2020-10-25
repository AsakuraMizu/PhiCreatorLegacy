import Click from '../../assets/skin/Click.png';
import ClickHL from '../../assets/skin/ClickHL.png';
import Drag from '../../assets/skin/Drag.png';
import DragHL from '../../assets/skin/DragHL.png';
import Flick from '../../assets/skin/Flick.png';
import FlickHL from '../../assets/skin/FlickHL.png';
import Hold from '../../assets/skin/Hold.png';
import HoldEnd from '../../assets/skin/HoldEnd.png';
import HoldHead from '../../assets/skin/HoldHead.png';
import Effect from '../../assets/skin/Effect.png';
import Square from '../../assets/skin/Square.png';

import type { Skin } from './Player';

const skin: Skin = {
  resources: {
    Click,
    ClickHL,
    Drag,
    DragHL,
    Flick,
    FlickHL,
    Hold,
    HoldEnd,
    HoldHead,
    Effect,
    Square,
  },
  noteRatio: 0.07,
  effect: {
    ratio: 0.43,
    size: 256,
    duration: 0.5,
    interval: 12,
    particle: {
      alpha: {
        start: 1,
        end: 0,
      },
      scale: {
        start: 50,
        end: 50,
        minimumScaleMultiplier: 1,
      },
      color: {
        start: '#ffeca0',
        end: '#ffeca0',
      },
      speed: {
        start: 2000,
        end: 2000,
        minimumSpeedMultiplier: 0.71,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      maxSpeed: 0,
      startRotation: {
        min: 0,
        max: 360,
      },
      noRotation: true,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 0.05,
        max: 0.05,
      },
      blendMode: 'normal',
      frequency: 0.001,
      emitterLifetime: -1,
      maxParticles: 5,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: false,
      spawnType: 'circle',
      spawnCircle: {
        x: 0,
        y: 0,
        r: 0,
      },
    },
  },
  color: 0xffeca0,
};

export default skin;
