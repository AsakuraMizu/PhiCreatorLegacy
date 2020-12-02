<script>
  import { _ } from 'svelte-i18n';
  import ListEdit from './ListEdit.svelte';
  import EventEdit from './EventEdit.svelte';
  import { chart, currentLineIndex, currentEventIndex, currentTick } from '../../store';
</script>

{#if $currentLineIndex in $chart.judgeLineList}
  <ListEdit
    fields={[
      { key: 'id', value: 'ID' },
      { key: 'type', value: $_('type') },
      { key: 'startTime', value: $_('starttime') },
      { key: 'endTime', value: $_('endtime') },
    ]}
    empty={{
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
    }}
    bind:rows={$chart.judgeLineList[$currentLineIndex].eventList}
    bind:selected={$currentEventIndex}
  />
  {#if $currentEventIndex in $chart.judgeLineList[$currentLineIndex].eventList}
    <EventEdit />
  {/if}
{/if}
