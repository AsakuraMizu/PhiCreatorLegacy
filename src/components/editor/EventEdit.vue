<template>
  <a-form :model="eventData">
    <a-form-item label="ID">
      <a-input-number
        :value="eventData.id"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item :label="t('type')">
      <a-radio-group
        v-model:value="eventData.type"
        @change="save"
      >
        <a-radio-button
          v-for="type in ['construct', 'move', 'rotate', 'fade', 'speed']"
          :key="type"
          :value="type"
        >
          {{ t(type) }} ({{ type }})
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="t('starttime')">
      <a-input-number
        v-model:value="eventData.startTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item :label="t('endtime')">
      <a-input-number
        v-model:value="eventData.endTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <template v-if="eventData.type === 'construct' || eventData.type === 'move'">
      <a-form-item label="X">
        <a-input-number
          v-model:value="eventData.properties.x"
          :step="0.01"
          @change="save"
        />
      </a-form-item>
      <a-form-item label="Y">
        <a-input-number
          v-model:value="eventData.properties.y"
          :step="0.01"
          @change="save"
        />
      </a-form-item>
    </template>
    <template v-if="eventData.type === 'move'">
      <a-form-item :label="t('easex')">
        <ease-select
          v-model:value="eventData.properties.easeX"
          @change="save"
        />
      </a-form-item>
      <a-form-item :label="t('easey')">
        <ease-select
          v-model:value="eventData.properties.easeX"
          @change="save"
        />
      </a-form-item>
    </template>
    <a-form-item
      v-if="eventData.type === 'construct' || eventData.type === 'rotate'"
      :label="t('angle')"
    >
      <a-input-number
        v-model:value="eventData.properties.angle"
        :step="0.01"
        @change="save"
      />
    </a-form-item>
    <a-form-item 
      v-if="eventData.type === 'construct' || eventData.type === 'fade'"
      :label="t('alpha')"
    >
      <a-input-number
        v-model:value="eventData.properties.alpha"
        :min="0"
        :max="1"
        :step="0.1"
        @change="save"
      />
    </a-form-item>
    <a-form-item
      v-if="eventData.type === 'construct' || eventData.type === 'speed'"
      :label="t('speed')"
    >
      <a-input-number
        v-model:value="eventData.properties.speed"
        :step="0.01"
        @change="save"
      />
    </a-form-item>
    <a-form-item
      v-if="eventData.type === 'rotate' || eventData.type === 'fade' || eventData.type === 'speed'"
      :label="t('ease')"
    >
      <ease-select
        v-model:value="eventData.properties.ease"
        @change="save"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import EaseSelect from './EaseSelect.vue';

import type { EventData } from '../../player/ChartData';

export default defineComponent({
  name: 'EventEdit',
  components: {
    EaseSelect
  },
  props: {
    data: {
      type: <PropType<EventData>>Object,
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
      eventData: this.data,
    };
  },
  watch: {
    data() {
      this.eventData = this.data;
    },
    'eventData.type'(type: EventData['type']) {
      switch (type) {
        case 'construct':
          this.eventData.properties = {
            x: 0,
            y: 0,
            angle: 0,
            alpha: 1,
            speed: 0.01,
          };
          break;
        case 'move':
          this.eventData.properties = {
            x: 0,
            y: 0,
            easeX: 'linear',
            easeY: 'linear',
          };
          break;
        case 'rotate':
          this.eventData.properties = {
            angle: 0,
            ease: 'linear',
          };
          break;
        case 'fade':
          this.eventData.properties = {
            alpha: 1,
            ease: 'linear',
          };
          break;
        case 'speed':
          this.eventData.properties = {
            speed: 0.01,
            ease: 'linear',
          };
          break;
        default:
          break;
      }
      this.save();
    }
  },
  methods: {
    save() {
      this.$emit('edit', this.eventData);
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
    angle: 'Angle',
    alpha: 'Alpha',
    speed: 'Speed',
    ease: 'Ease',
    easex: 'Ease X',
    easey: 'Ease Y',
    construct: 'Construct',
    move: 'Move',
    rotate: 'Rotate',
    fade: 'Fade',
    speed: 'Speed',
  },
  zh: {
    type: '类型',
    starttime: '开始时间',
    endtime: '结束时间',
    angle: '角度',
    alpha: '透明度',
    speed: '下落速度',
    ease: '缓动类型',
    easex: '缓动类型(X)',
    easey: '缓动类型(Y)',
    construct: '构造',
    move: '移动',
    rotate: '旋转',
    fade: '隐藏',
    speed: '速度',
  },
}
</i18n>
