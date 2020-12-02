<script>
  import ListEdit from './ListEdit.svelte';
  import { chart, currentLineIndex, currentTick } from '../../store';
</script>

<ListEdit
  fields={[
    { key: 'id', value: 'ID' },
  ]}
  empty={{
    noteList: [],
    eventList: [{
      id: 0,
      type: 'construct',
      startTime: $currentTick,
      endTime: $currentTick,
      properties: {
        x: 0,
        y: 0,
        angle: 0,
        alpha: 1,
        speed: 0.01,
      },
    }],
  }}
  bind:rows={$chart.judgeLineList}
  bind:selected={$currentLineIndex}
/>
