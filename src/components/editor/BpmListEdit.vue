<template>
  <a-tabs
    v-model:activeKey="activeKey"
    tab-position="top"
    type="editable-card"
    :hide-add="true"
    @edit="remove"
    @tabClick="tabClick"
  >
    <template #tabBarExtraContent>
      <a-button @click="add">
        {{ t('add') }}
      </a-button>
    </template>
    <a-tab-pane
      v-for="[id, data] in list"
      :key="id"
      :tab="`Bpm #${id}`"
      :closable="id !== 0"
    >
      <BpmEdit
        :data="data"
        @edit="onEditData(id, $event)"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import BpmEdit from './BpmEdit.vue';

import type { BpmData } from '../../player/ChartData';

export default defineComponent({
  name: 'BpmListEdit',
  components: {
    BpmEdit,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  data() {
    return {
      activeKey: <number>undefined,
      list: new Map<number, BpmData>(this.$store.state.chart.timing.bpmList.map(b => [b.id, b])),
      updateFlag: 0,
    };
  },
  computed: {
    lastId(): number {
      return Math.max(...this.list.keys(), -1);
    },
  },
  watch: {
    '$store.state.chart.timing.bpmList'(newBpmList: BpmData[]) {
      if (this.updateFlag > 0) {
        --this.updateFlag;
      } else {
        this.list = new Map<number, BpmData>(newBpmList.map(b => [b.id, b]));
        this.activeKey = this.lastId;
      }
    },
  },
  methods: {
    save() {
      ++this.updateFlag;
      this.$store.setChart({
        ...this.$store.state.chart,
        timing: {
          offset: this.$store.state.chart.timing.offset,
          bpmList: [...this.list.values()],
        },
      })
    },
    remove(targetKey: number) {
      this.list.delete(targetKey);
      if (this.activeKey === targetKey) {
        this.activeKey = this.lastId;
      }
      this.save();
    },
    add() {
      const id = this.lastId + 1;
      this.list.set(id, {
        id,
        time: this.$store.state.offset,
        bpm: 222.22,
      });
      this.activeKey = id;
      this.save();
    },
    onEditData(id: number, data: BpmData) {
      this.list.set(id, data);
      this.save();
    },
    tabClick(targetKey: number) {
      if ((this.$key.isPressed('ctrl') || this.$key.isPressed('command')) && targetKey !== 0) {
        this.remove(targetKey);
      }
    },
  },
});
</script>

<i18n lang="json5">
{
  en: {
    add: '+Add',
  },
  zh: {
    add: '+添加',
  },
}
</i18n>
