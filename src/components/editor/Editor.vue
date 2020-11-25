<template>
  <a-form>
    <a-form-item :label="t('offset')">
      <a-input-number
        :value="$store.state.offset"
        @update:value="$store.setOffset($event)"
      />
    </a-form-item>
    <a-form-item :label="t('maxoffset')">
      <a-input-number v-model:value="maxoffset" />
      {{ t('maxoffsetdesc') }}
    </a-form-item>
  </a-form>
  <a-slider
    :value="$store.state.offset"
    :min="0"
    :max="maxoffset"
    @update:value="$store.setOffset($event)"
  />
  <judge-line-list-edit
    :line-list="lines"
    @edit="save"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import JudgeLineListEdit from './JudgeLineListEdit.vue';

import type { ChartData, JudgeLineData } from '../../player/ChartData';

export default defineComponent({
  name: 'Editor',
  components: {
    JudgeLineListEdit,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  data() {
    return {
      maxoffset: 2880,
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

<i18n lang="json5">
{
  en: {
    offset: 'Offset',
    maxoffset: 'Max Offset',
    maxoffsetdesc: 'Tip: This value is ONLY used for helping you control the following bar better.',
  },
  zh: {
    offset: '偏移',
    maxoffset: '最大偏移',
    maxoffsetdesc: '提示：该值仅用来帮助你更好的控制下面的滚动条。',
  },
}
</i18n>
