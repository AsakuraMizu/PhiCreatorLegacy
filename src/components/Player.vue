<template>
<canvas id="player" />
</template>

<script>
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;

import Player from './player/Player';
import { skin, skinScale } from './player/skin';
import chart from './chart.json';

export default {
  name: 'Player',
  data() {
    return {
      player: undefined
    }
  },
  mounted() {
    const canvas = document.getElementById('player');

    this.player = new Player({
      canvas,
      skin,
      skinScale,
      chart
    });
    // this.player.fullscreen = true;
    // const handler = () => {
    //   this.player.fullscreen = false;
    //   document.removeEventListener('fullscreenchange', handler);
    // };
    // document.addEventListener('fullscreenchange', handler);
  },
}
</script>
