<script>
  import ListEdit from './ListEdit.svelte';
  import BpmEdit from './BpmEdit.svelte';
  import { chart, currentBpmIndex, currentTick } from '../../store';
</script>

<ListEdit
  fields={[
    { key: 'id', value: 'ID' },
    { key: 'bpm', value: 'Bpm' },
  ]}
  empty={{
    time: $currentTick,
    bpm: 222.22,
  }}
  bind:rows={$chart.timing.bpmList}
  bind:selected={$currentBpmIndex}
/>

{#if $currentBpmIndex in $chart.timing.bpmList}
  <BpmEdit />
{/if}
