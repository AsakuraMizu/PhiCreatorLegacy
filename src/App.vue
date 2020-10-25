<template>
<a-layout>
  <a-layout-content>
    <a-row>
      <a-col :md="{ span: 16, offset: 4 }" :offset="0" :span="24">
        <h1>PhiCreator</h1>
        <a-divider orientation="left">
          JSON Editor
        </a-divider>
        <json-editor v-model="chart" />
        <a-divider orientation="left">
          Preview Settings
        </a-divider>
        <a-row>
          <a-col :span="12">
            <a-input v-model:value="display.title" placeholder="Song Name" />
          </a-col>
          <a-col :span="12">
            <a-input v-model:value="display.diff" placeholder="Diffculty" />
          </a-col>
        </a-row>
        <br />
        <a-row>
          <a-col :span="12">
            <a-upload-dragger name="background" :showUploadList="false" :beforeUpload="beforeUploadBackground">
              <p class="ant-upload-drag-icon">
                <pic theme="outline" size="30" />
              </p>
              <p class="ant-upload-text">
                {{ display.background ? display.background.name : "Background" }}
              </p>
              <p class="ant-upload-hint">
                Click or drag file to this area
              </p>
            </a-upload-dragger>
          </a-col>
          <a-col :span="12">
            <a-upload-dragger name="music" :showUploadList="false" :beforeUpload="beforeUploadMusic">
              <p class="ant-upload-drag-icon">
                <music theme="outline" size="30" />
              </p>
              <p class="ant-upload-text">
                {{ display.music ? display.music.name : "Music" }}
              </p>
              <p class="ant-upload-hint">
                Click or drag file to this area
              </p>
            </a-upload-dragger>
          </a-col>
        </a-row>
        <a-button type="button" @click="() => { this.preview = true; }">
          Preview
        </a-button>
        <a-modal v-model:visible="preview" title="Preview" width="400" :destroyOnClose="true" :centered="true" :footer="null">
          <player :chart="chart" :display="display" />
        </a-modal>
      </a-col>
    </a-row>
  </a-layout-content>
  <a-layout-footer style="text-align: center">PhiCreator © 2020 PhiX Dev Team</a-layout-footer>
</a-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

import { Music, Pic } from '@icon-park/vue-next';
import Player from './components/Player.vue';
import JsonEditor from './components/JsonEditor.vue';
import { DisplayOptions } from './components/player/Player';

import chart from './chart.json';

export default defineComponent({
  name: 'App',
  components: {
    Player,
    JsonEditor,

    Music,
    Pic,
  },
  data() {
    return {
      chart: chart,
      display: <DisplayOptions>{
        title: null,
        diff: null,
        background: null,
        music: null,
      },
      preview: false,
    };
  },
  methods: {
    beforeUploadBackground(file: File) {
      this.display.background = file;
      return false;
    },
    beforeUploadMusic(file: File) {
      this.display.music = file;
      return false;
    },
  },
});
</script>
