<template>
  <a-form>
    <a-form-item :label="t('language')">
      <a-radio-group v-model:value="$i18n.locale">
        <a-radio-button value="en">
          English
        </a-radio-button>
        <a-radio-button value="zh">
          中文
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Settings',
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  data() {
    return {
      maxoffset: 2880,
    };
  },
});
</script>

<i18n lang="json5">
{
  en: {
    language: 'Language',
  },
  zh: {
    language: '语言',
  },
}
</i18n>
