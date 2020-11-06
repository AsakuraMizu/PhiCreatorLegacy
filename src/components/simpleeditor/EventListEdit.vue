<template>
  <list-edit
    v-slot="{ data, edited }"
    :data-list="eventList"
    :empty-data="{
      type: 'construct',
      startTime: 0,
      endTime: 0,
      properties: {
        x: 0,
        y: 0,
        angle: 0,
        alpha: 1,
        speed: 0.01,
      },
    }"
    name="Event"
    @edit="$emit('edit', $event)"
  >
    <event-edit
      :data="data"
      @edit="edited($event)"
    />
  </list-edit>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ListEdit from './ListEdit.vue';
import EventEdit from './EventEdit.vue';

import type { EventData } from '../../player/ChartData';

export default defineComponent({
  name: 'EventListEdit',
  components: {
    ListEdit,
    EventEdit,
  },
  props: {
    eventList: {
      type: <PropType<EventData[]>>Object,
      required: true,
    },
  },
  emits: ['edit'],
});
</script>
