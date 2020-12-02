<script>
  import { _ } from 'svelte-i18n';
  import { afterUpdate } from 'svelte';
  import screenfull from 'screenfull';
  import { Button } from 'carbon-components-svelte/src/Button';
  import { Toggle } from 'carbon-components-svelte/src/Toggle';
  import Play16 from 'carbon-icons-svelte/lib/Play16';
  import Pause16 from 'carbon-icons-svelte/lib/Pause16';
  import Maximize16 from 'carbon-icons-svelte/lib/Maximize16';
  import { background, chart, currentTick, difficulty, fxVolume, music, musicVolume, rate, title } from '../store';

  import Player from '../player/player';
  import skin from '../player/skins/phigros';

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {Player} */
  let player;

  let previewing = false;
  let ready = false;
  let paused = true;

  afterUpdate(() => {
    if (previewing && !player) {
      player = new Player({
        canvas,
        chart: $chart,
        preview: {
          title: $title,
          diff: $difficulty,
          background: $background,
          music: $music,
        },
        offset: $currentTick,
        rate: $rate,
        volume: {
          music: $musicVolume,
          fx: $fxVolume,
        },
        skin,
      }, () => {
        ready = true;
      });
    } else if (!previewing && player) {
      player.destroy();
      player = null;
      paused = true;
      ready = false;
    }
  });
</script>

<Toggle labelText={$_('preview')} labelA={$_('no')} labelB={$_('yes')} bind:toggled={previewing} />
{#if previewing}
  <canvas bind:this={canvas} />
  <Button
    hasIconOnly
    skeleton={!ready}
    iconDescription={paused ? $_('play') : $_('pause')}
    icon={paused ? Play16 : Pause16}
    on:click={() => {
      player.pause(!paused);
      paused = !paused;
    }}
  />
  {#if screenfull.isEnabled}
  <Button
    hasIconOnly
    iconDescription={$_('fullscreen')}
    icon={Maximize16}
    on:click={() => {
      screenfull.toggle(canvas);
    }}
  />
  {/if}
{/if}
