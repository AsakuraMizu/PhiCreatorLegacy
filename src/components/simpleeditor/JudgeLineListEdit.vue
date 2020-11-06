<template>
  <list-edit
    v-slot="{ data, edited }"
    :data-list="lineList"
    :empty-data="{
      eventList: [],
      noteList: [],
    }"
    name="Line"
    @edit="$emit('edit', $event)"
  >
    <judge-line-edit
      :data="data"
      @edit="edited($event)"
    />
  </list-edit>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ListEdit from './ListEdit.vue';
import JudgeLineEdit from './JudgeLineEdit.vue';

import type { JudgeLineData } from '../../player/ChartData';

export default defineComponent({
  name: 'JudgeLineListEdit',
  components: {
    ListEdit,
    JudgeLineEdit,
  },
  props: {
    lineList: {
      type: <PropType<JudgeLineData[]>>Object,
      required: true,
    },
  },
  emits: ['edit'],
});
</script>
