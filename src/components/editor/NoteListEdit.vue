<template>
  <a-row :gutter="16">
    <a-col :md="12">
      <note-list-scroll-edit
        :note-list="noteList"
        @edit="$emit('edit', $event)"
        @select="list.activeKey = $event"
      />
    </a-col>
    <a-col :md="12">
      <list-edit
        ref="list"
        v-slot="{ data, edited }"
        :data-list="noteList"
        :empty-data="{
          type: 'click',
          startTime: $store.state.offset,
          endTime: $store.state.offset,
          showTime: 0,
          relativeX: 0,
          side: 1,
          speed: 1,
          isFake: false,
        }"
        name="Note"
        @edit="$emit('edit', $event)"
      >
        <note-edit
          :data="data"
          @edit="edited($event)"
        />
      </list-edit>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ListEdit from './ListEdit.vue';
import NoteEdit from './NoteEdit.vue';
import NoteListScrollEdit from './NoteListScrollEdit.vue';

import type { NoteData } from '../../player/ChartData';

export default defineComponent({
  name: 'NoteListEdit',
  components: {
    ListEdit,
    NoteEdit,
    NoteListScrollEdit,
  },
  props: {
    noteList: {
      type: <PropType<NoteData[]>>Object,
      required: true,
    },
  },
  emits: ['edit'],
  data() {
    return {
      list: <InstanceType<typeof ListEdit>>undefined,
    };
  },
  mounted() {
    this.list = <InstanceType<typeof ListEdit>>this.$refs.list;
  },
});
</script>
