<template>
  <a-tabs
    v-model:activeKey="activeKey"
    :tab-position="tabPosition"
    type="editable-card"
    :hide-add="true"
    @edit="remove"
    @tabClick="tabClick"
  >
    <template #tabBarExtraContent>
      <a-button
        @click="add"
      >
        +Add
      </a-button>
    </template>
    <a-tab-pane
      v-for="[id, data] in list"
      :key="id"
      :tab="`${name} #${id}`"
    >
      <slot
        :data="data"
        :edited="onEditData.bind(this, id)"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type DataType = {
  id: number;
};

export default defineComponent({
  name: 'ListEdit',
  props: {
    tabPosition: {
      type: String,
      default: 'left',
    },
    dataList: {
      type: <PropType<DataType[]>>Object,
      required: true,
    },
    emptyData: {
      type: <PropType<DataType>>Object,
      required: true,
    },
    name: {
      type: String,
      default: '',
    }
  },
  emits: ['edit'],
  data() {
    return {
      activeKey: <number>undefined,
      list: new Map<number, DataType>(this.dataList.map(d => [d.id, d])),
      updateFlag: 0,
    };
  },
  computed: {
    lastId(): number {
      return Math.max(...this.list.keys(), -1);
    },
  },
  watch: {
    dataList(newDataList: DataType[]) {
      if (this.updateFlag > 0) {
        --this.updateFlag;
      } else {
        this.list = new Map<number, DataType>(newDataList.map(d => [d.id, d]));
      }
    },
  },
  methods: {
    save() {
      ++this.updateFlag;
      this.$emit('edit', [...this.list.values()]);
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
        ...this.emptyData,
        id,
      });
      this.activeKey = id;
      this.save();
    },
    onEditData(id: number, data: DataType) {
      this.list.set(id, data);
      this.save();
    },
    tabClick(targetKey: number) {
      if (this.$key.isPressed('ctrl') || this.$key.isPressed('command')) {
        this.remove(targetKey);
      }
    },
  },
});
</script>
