<template>
  <a-form
    :model="bpmData"
    layout="inline"
  >
    <a-form-item label="ID">
      <a-input-number
        v-model:value="bpmData.id"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item :label="t('time')">
      <a-input-number
        v-model:value="bpmData.time"
        :step="10"
        :disabled="bpmData.id === 0"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('bpm')">
      <a-input-number
        v-model:value="bpmData.bpm"
        :step="1"
        @change="save"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import type { BpmData } from "../../player/ChartData";

export default defineComponent({
  name: 'BpmEdit',
  props: {
    data: {
      type: <PropType<BpmData>>Object,
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
  data() {
    return {
      bpmData: this.data,
    };
  },
  watch: {
    data() {
      this.bpmData = this.data;
    },
  },
  methods: {
    save() {
      this.$emit('edit', this.bpmData);
    },
  },
});
</script>

<i18n lang="json5">
{
  en: {
    time: 'Time',
    bpm: 'Bpm',
  },
  zh: {
    time: '时间',
    bpm: 'Bpm',
  },
}
</i18n>
