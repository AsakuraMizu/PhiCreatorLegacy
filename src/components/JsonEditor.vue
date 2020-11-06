<template>
  <div
    ref="editor"
    style="height: 400px;"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import JSONEditor, { JSONEditorMode, JSONEditorOptions } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import { ChartData } from '../player/ChartData';

// declare module 'jsoneditor' {
//   export interface JSONEditorOptions {
//     onBlur?: (event: { type: 'blur', target: HTMLElement }) => void;
//   }
// }

export default defineComponent({
  name: 'JsonEditor',
  props: {
    mode: {
      type: <PropType<JSONEditorMode>>String,
      default: 'code',
    },
    modes: {
      type: <PropType<JSONEditorMode[]>>Array,
      default: ['tree', 'code'],
    },
  },
  data() {
    return {
      editor: <JSONEditor>undefined,
      watchFlag: 0,
    }
  },
  watch: {
    '$store.state.chart'(newChart: ChartData) {
      if (this.watchFlag > 0) {
        --this.watchFlag;
      } else {
        this.editor.set(newChart);
      }
    },
  },
  mounted() {
    const options: JSONEditorOptions = {
      mode: this.mode,
      modes: this.modes,
      onChange: () => {
        try {
          const json = this.editor.get();
          this.$store.setChart(json);
          ++this.watchFlag;
        } catch { /** */ }
      },
    };

    this.editor = new JSONEditor(<HTMLDivElement>this.$refs.editor, options, this.$store.state.chart);
  },
  beforeUnmount() {
    this.editor.destroy();
  },
});
</script>
