<template>
  <a-tabs
    :active-key="$store.state.activePage"
    @update:activeKey="$store.setActivePage($event)"
  >
    <a-tab-pane
      key="note"
      :tab="t('notes')"
    >
      <note-list-edit
        :note-list="noteList"
        @edit="noteList = $event"
      />
    </a-tab-pane>
    <a-tab-pane
      key="event"
      :tab="t('events')"
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
import { useI18n } from 'vue-i18n';

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
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
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

<i18n lang="json5">
{
  en: {
    notes: 'Notes',
    events: 'Events',
  },
  zh: {
    notes: '音符',
    events: '事件',
  },
}
</i18n>
