<script>
  import { Select, SelectItem } from 'carbon-components-svelte/src/Select';

  const eases = [
    'linear',
    'jump',
    'backIn',
    'backOut',
    'bounceIn',
    'bounceOut',
    'circIn',
    'circOut',
    'cubicIn',
    'cubicOut',
    'elasticIn',
    'elasticOut',
    'expoIn',
    'expoOut',
    'quadIn',
    'quadOut',
    'quartIn',
    'quartOut',
    'quintIn',
    'quintOut',
    'sineIn',
    'sineOut',
  ];

  export let selected;
</script>

<Select {...$$restProps} bind:selected>
  {#each eases as ease}
    <SelectItem value={ease} text={ease} />
  {/each}
</Select>
