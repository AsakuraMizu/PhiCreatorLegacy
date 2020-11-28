<template>
  <options />
  <br>
  <judge-line-list-edit
    :line-list="lines"
    @edit="save"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Options from './Options.vue';
import JudgeLineListEdit from './JudgeLineListEdit.vue';

import type { JudgeLineData } from '../../player/ChartData';

export default defineComponent({
  name: 'Editor',
  components: {
    Options,
    JudgeLineListEdit,
  },
  data() {
    return {
      lines: this.$store.state.chart.judgeLineList,
    };
  },
  watch: {
    '$store.state.chart.judgeLineList'(newJudgeLineList: JudgeLineData[]) {
      this.lines = newJudgeLineList;
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
