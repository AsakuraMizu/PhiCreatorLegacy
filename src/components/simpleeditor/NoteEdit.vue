<template>
  <a-form :model="noteData">
    <a-form-item label="ID">
      <a-input-number
        v-model:value="noteData.id"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="Type">
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
    <a-form-item label="Start time">
      <a-input-number
        v-model:value="noteData.startTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="End time">
      <a-input-number
        v-model:value="noteData.endTime"
        :step="10"
        :disabled="noteData.type !== 'hold'"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="Show time">
      <a-input-number
        v-model:value="noteData.showTime"
        :step="10"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="Relative X">
      <a-input-number
        v-model:value="noteData.relativeX"
        :step="0.01"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="Side">
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
    <a-form-item label="Speed">
      <a-input-number
        v-model:value="noteData.speed"
        :step="0.1"
        @change="save"
      />
    </a-form-item>
    <a-form-item label="Is fake">
      <a-switch
        v-model:checked="noteData.isFake"
        @change="save"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
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
  data() {
    return {
      noteData: this.data,
    };
  },
  watch: {
    note() {
      this.noteData = this.data;
    },
    'noteData.startTime'() {
      if (this.noteData.type !== 'hold') {
        this.noteData.endTime = this.noteData.startTime;
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
