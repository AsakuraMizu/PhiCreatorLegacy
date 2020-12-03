<!-- Note: this is a bug fix. -->
<script>
  import { getContext } from 'svelte';
  import { _ } from 'svelte-i18n';
  import ListEdit from './ListEdit.svelte';
  import { chart, currentLineIndex, currentNoteIndex, currentTick } from '../../store';

  let { selectedIds } = getContext('selectedIds');
</script>

<ListEdit
  fields={[
    { key: 'id', value: 'ID' },
    { key: 'type', value: $_('type') },
    { key: 'endTime', value: $_('endtime') },
  ]}
  empty={{
    type: 'click',
    startTime: $currentTick,
    endTime: $currentTick,
    relativeX: 0,
    side: 1,
    speed: 1,
    isFake: false,
  }}
  bind:rows={$chart.judgeLineList[$currentLineIndex].noteList}
  bind:selected={$currentNoteIndex}
  bind:selectedRowIds={$selectedIds}
/>
