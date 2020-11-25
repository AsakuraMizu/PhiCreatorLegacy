<template>
  <a-tabs>
    <a-tab-pane
      key="note"
      tab="Notes"
    >
      <note-list-edit
        :note-list="noteList"
        @edit="noteList = $event"
      />
    </a-tab-pane>
    <a-tab-pane
      key="anim"
      tab="Events"
    >
      <event-list-edit
        :event-list="eventList"
        @edit="eventList = $event"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import NoteListEdit from './NoteListEdit.vue';
import EventListEdit from './EventListEdit.vue';

import type { EventData, JudgeLineData, NoteData } from '../../player/ChartData';

export default defineComponent({
  name: 'LineEdit',
  components: {
    NoteListEdit,
    EventListEdit,
  },
  props: {
    data: {
      type: <PropType<JudgeLineData>>Object,
      required: true,
    },
  },
  emits: ['edit'],
  computed: {
    noteList: {
      get(): NoteData[] {
        return this.data.noteList;
      },
      set(noteList: NoteData[]) {
        this.$emit('edit', {
          ...this.data,
          noteList,
        });
      },
    },
    eventList: {
      get(): EventData[] {
        return this.data.eventList;
      },
      set(eventList: EventData[]) {
        this.$emit('edit', {
          ...this.data,
          eventList,
        });
      },
    },
  }
});
</script>
