<template>
<canvas id="canvas" />
</template>

<script lang='ts'>
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;

import { defineComponent, PropType } from 'vue';
import screenfull from 'screenfull';

import Player, { DisplayOptions } from './player/Player';
import { ChartData } from './player/ChartData';
import skin from './player/skin';

export default defineComponent({
  name: 'Player',
  props: {
    // fullscreen: {
    //   type: Boolean,
    //   default: false,
    // },
    chart: <PropType<ChartData>>Object,
    display: <PropType<DisplayOptions>>Object,
  },
  data() {
    return {
      player: <Player>null,
      canvas: <HTMLCanvasElement>null,
    };
  },
  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.player = new Player({
      canvas: this.canvas,
      chart: this.chart,
      display: this.display,
      skin,
    });
    this.canvas.width = this.player.width;
    this.canvas.height = this.player.height;
    // this.setFullscreen(this.fullscreen);
    // screenfull.isEnabled && screenfull.on('change', () => {
    //   this.setFullscreen(screenfull.isEnabled && screenfull.isFullscreen);
    // })
  },
  // methods: {
  //   setFullscreen(value: boolean) {
  //     screenfull.isEnabled && (value ? screenfull.request(this.canvas) : screenfull.exit()).then(() => {
  //       this.player.fullscreen = value;
  //     });
  //   }
  // }
});
</script>
