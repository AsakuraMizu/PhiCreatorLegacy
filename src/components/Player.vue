<template>
  <canvas ref="player" />
  <br>
  <a-button
    type="primary"
    :loading="!ready"
    @click="pause"
  >
    <template #icon>
      <play-one
        v-if="paused"
        theme="outline"
        size="30"
        :stroke-width="2"
      />
      <pause v-else />
    </template>
  </a-button>
  <a-button
    v-if="screenfullEnabled"
    @click="fullscreen()"
  >
    <template #icon>
      <full-screen-two
        v-if="!full"
        theme="outline"
        size="30"
        :stroke-width="2"
      />
      <off-screen-two v-else />
    </template>
  </a-button>
</template>

<script lang='ts'>
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;

import { defineComponent, PropType } from 'vue';
import _screenfull, { Screenfull } from 'screenfull';
const screenfull = <Screenfull>_screenfull;

import { PlayOne, Pause, FullScreenTwo, OffScreenTwo } from '@icon-park/vue-next';

import Player from '../player/Player';
import type { PreviewOptions } from '../player/Player';
import skin from '../player/skins/official';

export default defineComponent({
  name: 'Player',
  components: {
    PlayOne,
    Pause,
    FullScreenTwo,
    OffScreenTwo,
  },
  props: {
    preview: {
      type: <PropType<PreviewOptions>>Object,
      required: true,
    },
  },
  data() {
    return {
      player: <Player>undefined,
      canvas: <HTMLCanvasElement>undefined,
      ready: false,
      paused: true,
      full: false,
      screenfullEnabled: true,
    };
  },
  mounted() {
    this.canvas = <HTMLCanvasElement>this.$refs.player;
    this.player = new Player({
      canvas: this.canvas,
      chart: this.$store.state.chart,
      preview: this.preview,
      skin,
    }, () => {
      this.ready = true;
    });
    // this.player.resize(this.width, this.height);
    this.canvas.width = this.player.width;
    this.canvas.height = this.player.height;
    this.screenfullEnabled = screenfull.isEnabled;
    if (this.screenfullEnabled) {
      screenfull.onchange(() => {
        this.full = screenfull.isFullscreen;
        // this.player.resize(this.width, this.height);
      });
    }
  },
  beforeUnmount() {
    this.player.destroy();
  },
  methods: {
    pause() {
      this.player.pause(!this.paused);
      this.paused = !this.paused;
    },
    fullscreen() {
      screenfull.toggle(this.canvas);
      this.full = !this.full;
      // this.player.resize(window.innerWidth, window.innerHeight);
    },
  },
});
</script>
