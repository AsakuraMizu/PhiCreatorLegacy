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
              key="settings"
              :header="t('settings')"
            >
              <settings />
            </a-collapse-panel>
            <a-collapse-panel
              key="editor"
              :header="t('editor')"
            >
              <editor />
            </a-collapse-panel>
            <a-collapse-panel
              key="preview"
              :header="t('preview')"
            >
              <preview />
            </a-collapse-panel>
            <a-collapse-panel
              key="rawjson"
              :header="t('rawjson')"
            >
              <raw-json />
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      PhiCreator © 2020 <a href="https://github.com/phi-x">PhiX Dev Team</a>
      <br>
      <a href="https://github.com/phi-x/PhiCreator">View on <github size="14" />  GitHub</a>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_ICON_CONFIGS, IconProvider, Github } from '@icon-park/vue-next';

import Settings from './components/Settings.vue';
import Editor from './components/editor/Editor.vue';
import Preview from './components/Preview.vue';
import RawJson from './components/RawJson.vue';

export default defineComponent({
  name: 'App',
  components: {
    Settings,
    Editor,
    Preview,
    RawJson,
    Github,
  },
  setup() {
    IconProvider({
      ...DEFAULT_ICON_CONFIGS,
      theme: 'outline',
      size: 30,
      strokeWidth: 3,
    });

    const { t } = useI18n();
    return {
      t,
    };
  },
  data() {
    return {
      activeKey: ['settings', 'editor', 'preview', 'rawjson'],
    };
  },
});
</script>

<i18n lang="json5">
{
  en: {
    settings: 'Editor Settings',
    editor: 'Editor',
    preview: 'Preview',
    rawjson: 'Raw JSON',
  },
  zh: {
    settings: '编辑器选项',
    editor: '编辑器',
    preview: '预览',
    rawjson: '原始 JSON 数据',
  },
}
</i18n>
