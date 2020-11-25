<template>
  <a-select
    v-model:value="selectValue"
    :options="eases"
    @change="change"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Ease } from '../../player/ChartData';

export default defineComponent({
  name: 'EaseSelect',
  props: {
    value: {
      type: <PropType<Ease>>String,
      default: 'linear',
    },
  },
  emits: ['update:value', 'change'],
  data() {
    return {
      selectValue: this.value,
      eases: <{ value: Ease }[]>[
        { value: 'linear' },
        { value: 'jump' },
        { value: 'backIn' },
        { value: 'backOut' },
        { value: 'bounceIn' },
        { value: 'bounceOut' },
        { value: 'circIn' },
        { value: 'circOut' },
        { value: 'cubicIn' },
        { value: 'cubicOut' },
        { value: 'elasticIn' },
        { value: 'elasticOut' },
        { value: 'expoIn' },
        { value: 'expoOut' },
        { value: 'quadIn' },
        { value: 'quadOut' },
        { value: 'quartIn' },
        { value: 'quartOut' },
        { value: 'quintIn' },
        { value: 'quintOut' },
        { value: 'sineIn' },
        { value: 'sineOut' },
      ],
    };
  },
  methods: {
    change() {
      this.$emit('update:value', this.selectValue);
      this.$emit('change', this.selectValue);
    },
  },
});
</script>