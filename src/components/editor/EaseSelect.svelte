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
</script>

<Select {...$$restProps}>
  {#each eases as ease}
    <SelectItem value={ease} text={ease} />
  {/each}
</Select>
