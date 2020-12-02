<script>
  import { _ } from 'svelte-i18n';
  import { afterUpdate } from 'svelte';
  import { Tile } from 'carbon-components-svelte/src/Tile';
  import { Form } from 'carbon-components-svelte/src/Form';
  import { FormGroup } from 'carbon-components-svelte/src/FormGroup';
  import { NumberInput } from 'carbon-components-svelte/src/NumberInput';
  import { RadioButton } from 'carbon-components-svelte/src/RadioButton';
  import { RadioButtonGroup } from 'carbon-components-svelte/src/RadioButtonGroup';
  import { Toggle } from 'carbon-components-svelte/src/Toggle';
  import EaseSelect from './EaseSelect.svelte';
  import { chart, currentLineIndex, currentEventIndex } from '../../store';

  let prevType = $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type;

  afterUpdate(() => {
    const type = $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type;
    if (prevType !== type) {
      switch (type) {
        case 'construct':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            x: 0,
            y: 0,
            angle: 0,
            alpha: 1,
            speed: 0.01,
          };
          break;
        case 'move':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            x: 0,
            y: 0,
            easeX: 'linear',
            easeY: 'linear',
          };
          break;
        case 'rotate':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            angle: 0,
            ease: 'linear',
          };
          break;
        case 'fade':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            alpha: 1,
            ease: 'linear',
          };
          break;
        case 'speed':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            speed: 0.01,
            ease: 'jump',
          };
          break;
        case 'notevis':
          $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties = {
            visibility: false,
          };
          break;
        default:
          break;
      }
      prevType = type;
    }
  });
</script>

<Tile>
  <Form>
    <NumberInput label="ID" value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].id} disabled />
    <FormGroup legendText={$_('type')}>
      <RadioButtonGroup bind:selected={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type}>
        {#each ['construct', 'move', 'rotate', 'fade', 'speed', 'notevis'] as type}
          <RadioButton value={type} labelText={type} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
    <NumberInput label={$_('starttime')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].startTime} />
    <NumberInput label={$_('endtime')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].endTime} />
    {#if ['construct', 'move'].includes($chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type)}
      <NumberInput label={$_('x')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.x} />
      <NumberInput label={$_('y')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.y} />
    {/if}
    {#if $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type === 'move'}
      <EaseSelect labelText={$_('easex')} bind:selected={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.easeX} />
      <EaseSelect labelText={$_('easey')} bind:selected={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.easeY} />
    {/if}
    {#if $chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type === 'notevis'}
      <Toggle labelText={$_('visibility')} labelA={$_('hide')} labelB={$_('show')} bind:toggled={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.visibility} />
    {/if}
    {#if ['construct', 'rotate'].includes($chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type)}
      <NumberInput label={$_('angle')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.angle} />
    {/if}
    {#if ['construct', 'fade'].includes($chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type)}
      <NumberInput label={$_('alpha')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.alpha} />
    {/if}
    {#if ['construct', 'speed'].includes($chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type)}
      <NumberInput label={$_('speed')} bind:value={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.speed} />
    {/if}
    {#if ['rotate', 'fade', 'speed'].includes($chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].type)}
      <EaseSelect labelText={$_('ease')} bind:selected={$chart.judgeLineList[$currentLineIndex].eventList[$currentEventIndex].properties.ease} />
    {/if}
  </Form>
</Tile>
