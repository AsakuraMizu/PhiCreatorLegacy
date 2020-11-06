<template>
  <a-form :model="eventData">
    <a-form-item label="ID">
      <a-input-number
        v-model:value="eventData.id"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="Type">
      <a-radio-group
        v-model:value="eventData.type"
        @change="save"
      >
        <a-radio-button
          v-for="type in ['construct', 'move', 'rotate', 'fade', 'speed']"
          :key="type"
          :value="type"
        >
          {{ type }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Start time">
      <a-input-number
        v-model:value="eventData.startTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="End time">
      <a-input-number
        v-model:value="eventData.endTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form :model="eventData.properties">
      <template v-if="eventData.type === 'construct'">
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
        <a-form-item label="Angle">
          <a-input-number
            v-model:value="eventData.properties.angle"
            :step="0.01"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Alpha">
          <a-input-number
            v-model:value="eventData.properties.alpha"
            :min="0"
            :max="1"
            :step="0.1"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Speed">
          <a-input-number
            v-model:value="eventData.properties.speed"
            :step="0.01"
            @change="save"
          />
        </a-form-item>
      </template>
      <template v-else-if="eventData.type === 'move'">
        <a-form-item label="X">
          <a-input-number
            v-model:value="eventData.properties.x"
            :step="0.01"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Ease X">
          <ease-select
            v-model:value="eventData.properties.easeX"
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
        <a-form-item label="Ease Y">
          <ease-select
            v-model:value="eventData.properties.easeX"
            @change="save"
          />
        </a-form-item>
      </template>
      <template v-else-if="eventData.type === 'rotate'">
        <a-form-item label="Angle">
          <a-input-number
            v-model:value="eventData.properties.angle"
            :step="0.01"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Ease">
          <ease-select
            v-model:value="eventData.properties.ease"
            @change="save"
          />
        </a-form-item>
      </template>
      <template v-else-if="eventData.type === 'fade'">
        <a-form-item label="Alpha">
          <a-input-number
            v-model:value="eventData.properties.alpha"
            :min="0"
            :max="1"
            :step="0.1"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Ease">
          <ease-select
            v-model:value="eventData.properties.ease"
            @change="save"
          />
        </a-form-item>
      </template>
      <template v-else-if="eventData.type === 'speed'">
        <a-form-item label="Speed">
          <a-input-number
            v-model:value="eventData.properties.speed"
            :step="0.01"
            @change="save"
          />
        </a-form-item>
        <a-form-item label="Ease">
          <ease-select
            v-model:value="eventData.properties.ease"
            @change="save"
          />
        </a-form-item>
      </template>
    </a-form>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
  data() {
    return {
      eventData: this.data,
    };
  },
  watch: {
    data() {
      this.eventData = this.data;
    },
    'eventData.type'() {
      switch (this.eventData.type) {
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
    },
  },
  methods: {
    save() {
      this.$emit('edit', this.eventData);
    },
  },
});
</script>
