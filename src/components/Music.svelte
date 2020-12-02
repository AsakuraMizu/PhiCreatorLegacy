<script>
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { Howl } from 'howler';
  import { HeaderGlobalAction } from 'carbon-components-svelte/src/UIShell';
  import Play16 from 'carbon-icons-svelte/lib/Play16';
  import Pause16 from 'carbon-icons-svelte/lib/Pause16';
  import { currentTime, music, rate, musicVolume } from '../store';

  $: howl = $music ? new Howl({ src: $music }) : null;
  $: if (howl) {
    howl.rate($rate);
    howl.volume($musicVolume);
  }

  let paused = true;
  let handle = setInterval(() => {
    if (howl) {
      if (howl.playing()) {
        currentTime.set(howl.seek());
      } else {
        howl.seek(get(currentTime));
      }
    }
  });

  onDestroy(() => {
    clearInterval(handle);
  });
</script>

{#if howl}
  <HeaderGlobalAction
    icon={paused ? Play16 : Pause16}
    on:click={() => {
      paused = !paused;
      howl[paused ? 'pause' : 'play']();
    }}
  />
{/if}
