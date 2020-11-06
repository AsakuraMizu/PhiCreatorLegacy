<template>
  <list-edit
    v-slot="{ data, edited }"
    :data-list="noteList"
    :empty-data="{
      type: 'click',
      startTime: 0,
      endTime: 0,
      showTime: 0,
      relativeX: 0,
      side: 1,
      speed: 1,
      isFake: false,
    }"
    name="Note"
    @edit="$emit('edit', $event)"
  >
    <note-edit
      :data="data"
      @edit="edited($event)"
    />
  </list-edit>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ListEdit from './ListEdit.vue';
import NoteEdit from './NoteEdit.vue';

import type { NoteData } from '../../player/ChartData';

export default defineComponent({
  name: 'NoteListEdit',
  components: {
    ListEdit,
    NoteEdit,
  },
  props: {
    noteList: {
      type: <PropType<NoteData[]>>Object,
      required: true,
    },
  },
  emits: ['edit'],
});
</script>
