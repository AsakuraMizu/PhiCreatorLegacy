<template>
  <b>Shotcuts:</b>
  <p>Ctrl+Click (or Command+Click on MacOS) on a line (or note, event, etc) to delete it.</p>
  <judge-line-list-edit
    :line-list="lines"
    @edit="save"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import JudgeLineListEdit from './JudgeLineListEdit.vue';

import type { ChartData, JudgeLineData } from '../../player/ChartData';

export default defineComponent({
  name: 'SimpleEditor',
  components: {
    JudgeLineListEdit,
  },
  data() {
    return {
      lines: this.$store.state.chart.judgeLineList,
    };
  },
  watch: {
    '$store.state.chart'(newChart: ChartData) {
      this.lines = newChart.judgeLineList;
    },
  },
  methods: {
    save(lines: JudgeLineData[]) {
      this.$store.setChart({
        ...this.$store.state.chart,
        judgeLineList: lines,
      });
    },
  },
});
</script>
