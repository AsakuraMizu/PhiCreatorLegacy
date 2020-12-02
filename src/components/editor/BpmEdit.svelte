<script>
  import { _ } from 'svelte-i18n';
  import { Tile } from 'carbon-components-svelte/src/Tile';
  import { Form } from 'carbon-components-svelte/src/Form';
  import { NumberInput } from 'carbon-components-svelte/src/NumberInput';
  import { chart, currentBpmIndex } from '../../store';
</script>

<Tile>
  <Form>
    <NumberInput label="ID" value={$chart.timing.bpmList[$currentBpmIndex].id} disabled />
    <NumberInput label={$_('time')} bind:value={$chart.timing.bpmList[$currentBpmIndex].time} disabled={$chart.timing.bpmList[$currentBpmIndex].id === 0} />
    <NumberInput label="Bpm" bind:value={$chart.timing.bpmList[$currentBpmIndex].bpm} />
  </Form>
</Tile>
