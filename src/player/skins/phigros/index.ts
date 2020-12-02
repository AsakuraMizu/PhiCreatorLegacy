import Click from './Click.png';
import ClickHL from './ClickHL.png';
import Drag from './Drag.png';
import DragHL from './DragHL.png';
import Flick from './Flick.png';
import FlickHL from './FlickHL.png';
import Hold from './Hold.png';
import HoldEnd from './HoldEnd.png';
import HoldHead from './HoldHead.png';
import Effect from './Effect.png';
import Particle from './Particle.png';
import Pause from './Pause.png';
import Prefix from './Prefix.png';
import Progress from './Progress.png';
import tap from './tap.wav';
import flick from './flick.wav';
import drag from './drag.wav';
import skin from './skin.json';

export default {
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
    Particle,
    Pause,
    Prefix,
    Progress,
  },
  fx: {
    tap,
    flick,
    drag,
  },
  ...skin,
}
