<template>
  <a-row>
    <a-col :span="12">
      <a-input
        v-model:value="preview.title"
        placeholder="Song Name"
      />
    </a-col>
    <a-col :span="12">
      <a-input
        v-model:value="preview.diff"
        placeholder="Diffculty"
      />
    </a-col>
  </a-row>
  <br>
  <a-row>
    <a-col :span="12">
      <a-upload-dragger
        name="background"
        :show-upload-list="false"
        :before-upload="beforeUploadBackground"
      >
        <p class="ant-upload-drag-icon">
          <pic />
        </p>
        <p class="ant-upload-text">
          {{ preview.background ? preview.background.name : "Background" }}
        </p>
        <p class="ant-upload-hint">
          Click or drag file to this area
        </p>
      </a-upload-dragger>
    </a-col>
    <a-col :span="12">
      <a-upload-dragger
        name="music"
        :show-upload-list="false"
        :before-upload="beforeUploadMusic"
      >
        <p class="ant-upload-drag-icon">
          <music />
        </p>
        <p class="ant-upload-text">
          {{ preview.music ? preview.music.name : "Music" }}
        </p>
        <p class="ant-upload-hint">
          Click or drag file to this area
        </p>
      </a-upload-dragger>
    </a-col>
  </a-row>
  <a-button @click="previewing = true">
    Preview
  </a-button>
  <a-modal
    v-model:visible="previewing"
    title="Preview"
    width="400"
    :destroy-on-close="true"
    :centered="true"
    :footer="null"
  >
    <player :preview="preview" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Music, Pic } from '@icon-park/vue-next';
import Player from './Player.vue';

import type { PreviewOptions } from '../player/Player';

export default defineComponent({
  name: 'Preview',
  components: {
    Player,

    Music,
    Pic,
  },
  data() {
    return {
      preview: <PreviewOptions>{
        title: undefined,
        diff: undefined,
        background: undefined,
        music: undefined,
      },
      previewing: false,
    };
  },
  methods: {
    beforeUploadBackground(file: File) {
      this.preview.background = file;
      return false;
    },
    beforeUploadMusic(file: File) {
      this.preview.music = file;
      return false;
    },
  },
})
</script>
