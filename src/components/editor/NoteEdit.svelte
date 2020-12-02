<script>
  import { _ } from 'svelte-i18n';
  import { Tile } from 'carbon-components-svelte/src/Tile';
  import { Form } from 'carbon-components-svelte/src/Form';
  import { FormGroup } from 'carbon-components-svelte/src/FormGroup';
  import { NumberInput } from 'carbon-components-svelte/src/NumberInput';
  import { RadioButton } from 'carbon-components-svelte/src/RadioButton';
  import { RadioButtonGroup } from 'carbon-components-svelte/src/RadioButtonGroup';
  import { Toggle } from 'carbon-components-svelte/src/Toggle';
  import { chart, currentLineIndex, currentNoteIndex } from '../../store';

  $: if ($chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].type !== 'hold' && $chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].startTime !== $chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].endTime) {
    $chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].endTime = $chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].startTime;
  }
</script>

<Tile>
  <Form>
    <NumberInput label="ID" value={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].id} disabled />
    <FormGroup legendText={$_('type')}>
      <RadioButtonGroup bind:selected={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].type}>
        {#each ['click', 'flick', 'drag', 'hold'] as type}
          <RadioButton value={type} labelText={type} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
    <NumberInput label={$_('starttime')} bind:value={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].startTime} />
    <NumberInput label={$_('endtime')} bind:value={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].endTime} disabled={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].type !== 'hold'} />
    <NumberInput label={$_('relativex')} bind:value={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].relativeX} />
    <FormGroup legendText={$_('side')}>
      <RadioButtonGroup bind:selected={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].side}>
        {#each [1, -1] as side}
          <RadioButton value={side} labelText={side} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
    <NumberInput label={$_('speed')} bind:value={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].speed} />
    <Toggle labelText={$_('isfake')} labelA={$_('no')} labelB={$_('yes')} bind:toggled={$chart.judgeLineList[$currentLineIndex].noteList[$currentNoteIndex].isFake} />
  </Form>
</Tile>
