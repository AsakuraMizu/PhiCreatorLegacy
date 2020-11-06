<template>
  <a-layout>
    <a-layout-content>
      <a-row>
        <a-col
          :md="{ span: 16, offset: 4 }"
          :offset="0"
          :span="24"
        >
          <h1>PhiCreator</h1>
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel
              key="jsoneditor"
              header="JSON Editor"
            >
              <json-editor />
            </a-collapse-panel>
            <a-collapse-panel
              key="simpleeditor"
              header="Simple Editor"
            >
              <simple-editor />
            </a-collapse-panel>
            <a-collapse-panel
              key="preview"
              header="Preview"
            >
              <preview />
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      PhiCreator © 2020 PhiX Dev Team
    </a-layout-footer>
  </a-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/vue-next';

import JsonEditor from './components/JsonEditor.vue';
import SimpleEditor from './components/simpleeditor/SimpleEditor.vue';
import Preview from './components/Preview.vue';

export default defineComponent({
  name: 'App',
  components: {
    JsonEditor,
    SimpleEditor,
    Preview,
  },
  setup() {
    IconProvider({
      ...DEFAULT_ICON_CONFIGS,
      theme: 'outline',
      size: 30,
      strokeWidth: 3,
    });
  },
  data() {
    return {
      activeKey: ['jsoneditor', 'simpleeditor', 'preview'],
    };
  },
});
</script>
