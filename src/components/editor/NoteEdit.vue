<template>
  <a-form :model="noteData">
    <a-form-item label="ID">
      <a-input-number
        v-model:value="noteData.id"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item :label="t('type')">
      <a-radio-group
        v-model:value="noteData.type"
        @change="save"
      >
        <a-radio-button
          v-for="type in ['click', 'flick', 'drag', 'hold']"
          :key="type"
          :value="type"
        >
          {{ type }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="t('starttime')">
      <a-input-number
        v-model:value="noteData.startTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('endtime')">
      <a-input-number
        v-model:value="noteData.endTime"
        :step="10"
        :disabled="noteData.type !== 'hold'"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('showtime')">
      <a-input-number
        v-model:value="noteData.showTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('relativex')">
      <a-input-number
        v-model:value="noteData.relativeX"
        :step="0.01"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('side')">
      <a-radio-group
        v-model:value="noteData.side"
        @change="save"
      >
        <a-radio-button
          v-for="side in [1, -1]"
          :key="side"
          :value="side"
        >
          {{ side }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="t('speed')">
      <a-input-number
        v-model:value="noteData.speed"
        :step="0.1"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('isfake')">
      <a-switch
        v-model:checked="noteData.isFake"
        @change="save"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useI18n } from 'vue-i18n';

import type { NoteData } from "../../player/ChartData";

export default defineComponent({
  name: "NoteEdit",
  props: {
    data: {
      type: <PropType<NoteData>>Object,
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
      noteData: this.data,
    };
  },
  watch: {
    data() {
      this.noteData = this.data;
    },
    'noteData.type'() {
      if (this.noteData.type !== 'hold') {
        this.noteData.endTime = this.noteData.startTime;
        this.save();
      }
    },
    'noteData.startTime'() {
      if (this.noteData.type !== 'hold') {
        this.noteData.endTime = this.noteData.startTime;
        this.save();
      }
    },
  },
  methods: {
    save() {
      this.$emit('edit', this.noteData);
    },
  },
});
</script>

<i18n lang="json5">
{
  en: {
    type: 'Type',
    starttime: 'Start Time',
    endtime: 'End Time',
    showtime: 'Show Time',
    relativex: 'Relative X',
    side: 'Side',
    speed: 'Speed',
    isfake: 'Is Fake',
  },
  zh: {
    type: '类型',
    starttime: '开始时间',
    endtime: '结束时间',
    showtime: '显示时间',
    relativex: '相对坐标',
    side: '下落方向',
    speed: '下落速度',
    isfake: '假音符',
  },
}
</i18n>
