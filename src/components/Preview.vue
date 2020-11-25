<template>
  <a-row>
    <a-col :span="12">
      <a-input
        v-model:value="preview.title"
        :placeholder="t('songname')"
      />
    </a-col>
    <a-col :span="12">
      <a-input
        v-model:value="preview.diff"
        :placeholder="t('diff')"
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
          {{ preview.background ? preview.background.name : t('background') }}
        </p>
        <p class="ant-upload-hint">
          {{ t('upload') }}
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
          {{ preview.music ? preview.music.name : t('music') }}
        </p>
        <p class="ant-upload-hint">
          {{ t('upload') }}
        </p>
      </a-upload-dragger>
    </a-col>
  </a-row>
  <a-button @click="previewing = true">
    {{ t('preview') }}
  </a-button>
  <a-modal
    v-model:visible="previewing"
    :title="t('preview')"
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
import { useI18n } from 'vue-i18n';
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
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
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

<i18n lang="json5">
{
  en: {
    songname: 'Song Name',
    diff: 'Difficulty',
    background: 'Background',
    music: 'Music',
    upload: 'Click or drag file to this area',
    preview: 'Preview',
  },
  zh: {
    songname: '名称',
    diff: '难度',
    background: '背景',
    music: '音乐',
    upload: '单击或拖拽文件到此处',
    preview: '预览',
  },
}
</i18n>
