<template>
  <div
    ref="area"
    class="root"
    @wheel="wheel"
    @mousemove="mousemove"
    @mouseenter="editable = true"
    @mouseleave="editable = false"
  >
    <note-scroll-edit
      v-for="note in noteList"
      :key="note.id"
      :note="note"
      :full-width="rect.width"
      :full-height="rect.height"
      :block="block"
      @delete="$emit('edit', noteList.filter(n => n.id !== note.id))"
    />
  </div>
  <br>
  <a-row :gutter="16">
    <a-col :span="16">
      <a-slider
        v-model:value="block"
        :max="16"
        :marks="{
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          6: '6',
          8: '8',
          16: '16',
        }"
        :included="false"
      />
    </a-col>
    <a-col :span="4">
      <a-input-number
        v-model:value="block"
        :min="0"
      />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import NoteScrollEdit from './NoteScrollEdit.vue';

import type { NoteData } from '../../player/ChartData';

export default defineComponent({
  name: 'NoteListScrollEdit',
  components: {
    NoteScrollEdit,
  },
  props: {
    noteList: {
      type: <PropType<NoteData[]>>Object,
      required: true,
    },
  },
  emits: ['edit'],
  data() {
    return {
      area: <HTMLDivElement>undefined,
      editable: false,
      rect: <DOMRect>new DOMRect(0, 0, 0, 0),
      x: 0,
      y: 0,
      block: 1,
      holdId: -1,
    };
  },
  computed: {
    lastId(): number {
      let lastId = 0;
      this.noteList.forEach(n => {
        if (n.id > lastId) {
          lastId = n.id;
        }
      });
      return lastId;
    }
  },
  mounted() {
    this.area = this.$refs.area as HTMLDivElement;
    this.updateRect();
    window.addEventListener('resize', this.updateRect);
    window.addEventListener('scroll', this.updateRect);
    this.$key('1', this.addClickNote);
    this.$key('2', this.addFlickNote);
    this.$key('3', this.addDragNote);
    this.$key('4', { keydown: true, keyup: false }, this.addHoldNote);
    this.$key('4', { keydown: false, keyup: true }, this.addHoldNoteEnd);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateRect);
    window.removeEventListener('scroll', this.updateRect);
    this.$key.unbind('1', this.addClickNote);
    this.$key.unbind('2', this.addFlickNote);
    this.$key.unbind('3', this.addDragNote);
    this.$key.unbind('4', this.addHoldNote);
    this.$key.unbind('4', this.addHoldNoteEnd);
  },
  methods: {
    updateRect() {
      this.rect = this.area.getBoundingClientRect();
    },
    wheel(e: WheelEvent) {
      e.preventDefault();
      if (this.block != 0) {
        this.$store.setOffset(this.$store.state.offset - Math.sign(e.deltaY) * 72 / this.block);
      }
    },
    mousemove(e: MouseEvent) {
      this.x = (e.clientX - this.rect.x) / this.rect.width;
      this.y = (e.clientY - this.rect.y) / this.rect.height;

      if (Math.abs(this.y - Math.round(this.y * 15) / 15) <= 1e-2) {
        this.y = Math.round(this.y * 15) / 15;
      }

      if (this.holdId != -1) {
        const list: NoteData[] = [];
        for (const n of this.noteList) {
          if (n.id !== this.holdId) {
            list.push(n);
          } else {
            list.push({
              ...n,
              endTime: this.$store.state.offset + (1 - this.y) * 15 * 72 / this.block,
            });
          }
        }
        this.$emit('edit', list);
      }
    },
    addNote(type: NoteData['type']) {
      if (!this.editable) {
        return;
      }

      const time = this.$store.state.offset + (1 - this.y) * 15 * 72 / this.block;

      this.$emit('edit', [
        ...this.noteList,
        {
          id: this.lastId + 1,
          type,
          startTime: time,
          endTime: time,
          relativeX: this.x * 2 - 1,
          showTime: 0,
          side: 1,
          speed: 1,
          isFake: false,
        }
      ]);
    },
    addClickNote() {
      this.addNote('click');
    },
    addFlickNote() {
      this.addNote('flick');
    },
    addDragNote() {
      this.addNote('drag');
    },
    addHoldNote() {
      if (this.holdId === -1) {
        this.holdId = this.lastId + 1;
        this.addNote('hold');
      }
    },
    addHoldNoteEnd() {
      this.holdId = -1;
    },
  },
});
</script>

<style scoped>
.root {
  background-image: url('../../assets/image/bg.png');
  height: 480px;
  overflow: hidden;
  transform: translateZ(0);
}
</style>
