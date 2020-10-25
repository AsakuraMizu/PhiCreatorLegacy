<template>
  <div style="height: 400px;" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import JSONEditor, { JSONEditorMode, JSONEditorOptions } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

export default defineComponent({
  name: 'JsonEditor',
  emits: ['update:modelValue', 'error'],
  props: {
    modelValue: null,
    mode: {
      type: <PropType<JSONEditorMode>>String,
      default: 'code',
    },
    modes: {
      type: <PropType<JSONEditorMode[]>>Array,
      default: ['tree', 'code'],
    },
  },
  watch: {
    modelValue(val) {
      this.editor.set(val);
    },
  },
  data(){
    return {
      editor: <JSONEditor>null,
    }
  },
  mounted() {
    const options: JSONEditorOptions = {
      mode: this.mode,
      modes: this.modes,
      onChange: () => {
        try {
          let json = this.editor.get();
          this.$emit('update:modelValue', json);
        } catch (e) {
          this.$emit('error', e);
        }
      },
    };

    this.editor = new JSONEditor(this.$el, options, this.modelValue);
  },
  beforeUnmount() {
    this.editor.destroy();
  }
})
</script>
