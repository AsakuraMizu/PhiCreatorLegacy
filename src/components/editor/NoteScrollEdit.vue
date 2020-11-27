<template>
  <img
    v-if="y + height > 0 && y < fullHeight"
    class="note"
    :src="src"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
    :width="width"
    :height="height"
    @auxclick="$emit('delete')"
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import Blue from '../../assets/image/blue.png';
import Red from '../../assets/image/red.png';
import Yellow from '../../assets/image/yellow.png';

import type { NoteData } from '../../player/ChartData';

export default defineComponent({
  name: 'NoteScrollEdit',
  props: {
    note: {
      type: <PropType<NoteData>>Object,
      required: true,
    },
    fullWidth: {
      type: Number,
      required: true,
    },
    fullHeight: {
      type: Number,
      required: true,
    },
    block: {
      type: Number,
      required: true,
    },
  },
  emits: ['delete'],
  computed: {
    width(): number {
      return this.fullWidth / 8;
    },
    height(): number {
      return this.note.type === 'hold' ? this.fullHeight / 15 * (this.note.endTime - this.note.startTime) / 72 * this.block: this.fullHeight / 50;
    },
    x(): number {
      return (this.note.relativeX / 2 + 0.5) * this.fullWidth - this.width / 2;
    },
    y(): number {
      return this.fullHeight - (this.note.endTime - this.$store.state.offset) / 72 * this.block * (this.fullHeight / 15);
    },
    src(): string {
      switch (this.note.type) {
        case 'click': return Blue;
        case 'flick': return Red;
        case 'drag': return Yellow;
        case 'hold': return Blue;
        default: return '';
      }
    },
  },
});
</script>

<style scoped>
.note {
  position: absolute;
}
</style>
