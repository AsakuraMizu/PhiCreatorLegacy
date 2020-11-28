<template>
  <a-form>
    <a-form-item :label="t('chartoffset')">
      <a-input-number
        :value="$store.state.chart.timing.offset"
        @update:value="$store.setChart({
          ...$store.state.chart,
          timing: {
            ...$store.state.chart.timing,
            offset: $event,
          },
        })"
      />
    </a-form-item>
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
  <bpm-list-edit />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import BpmListEdit from './BpmListEdit.vue';

export default defineComponent({
  name: 'Options',
  components: {
    BpmListEdit,
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
    };
  },
});
</script>

<i18n lang="json5">
{
  en: {
    chartoffset: 'Chart Offset',
    offset: 'Offset',
    maxoffset: 'Max Offset',
    maxoffsetdesc: 'Tip: This value is ONLY used for helping you control the following bar better.',
  },
  zh: {
    chartoffset: '谱面偏移',
    offset: '偏移',
    maxoffset: '最大偏移',
    maxoffsetdesc: '提示：该值仅用来帮助你更好的控制下面的滚动条。',
  },
}
</i18n>
