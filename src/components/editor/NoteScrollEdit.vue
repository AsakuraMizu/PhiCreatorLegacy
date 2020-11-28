<template>
  <div
    v-if="y + height > 0 && y < fullHeight"
    ref="root"
    class="note"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${x}px, ${y}px)`,
      background: color,
    }"
    @auxclick="$emit('delete')"
  />
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, PropType } from 'vue';

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
  emits: ['delete', 'select', 'unselect'],
  setup() {
    const elMap: Map<Element, number> = inject('elMap');
    return {
      elMap,
    };
  },
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
    color(): string {
      switch (this.note.type) {
        case 'click': case 'hold': return '#0ac3ff';
        case 'flick': return '#fe4365';
        case 'drag': return '#f0ed69';
        default: return '';
      }
    },
  },
  mounted() {
    nextTick(() => {
      this.elMap.set(<Element>this.$refs.root, this.note.id);
    });
  },
});
</script>

<style scoped>
.note {
  position: absolute;
  user-select: none;
}
</style>
