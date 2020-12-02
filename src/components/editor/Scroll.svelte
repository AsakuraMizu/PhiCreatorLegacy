<script>
  import { onDestroy, onMount } from 'svelte';
  import { Slider } from 'carbon-components-svelte/src/Slider';
  import hotkeys from 'hotkeys-js';

  import { chart, currentLineIndex, currentTime, currentTick } from '../../store';

  /** @type {HTMLDivElement} */
  let ref;

  let block = 1;
  let editable = false;
  let x = 0;
  let y = 0;
  let holdid = -1;

  $: lastid = $chart.judgeLineList[$currentLineIndex].noteList.reduce((p, c) => Math.max(p, c.id), -1);

  /** @type {DOMRect} */
  let rect = new DOMRect(0, 0, 0, 0);
  const updateRect = () => {
    rect = ref.getBoundingClientRect();
  }
  onMount(updateRect);

  /** @param {WheelEvent} e */
  const wheel = e => {
    e.preventDefault();
    currentTime.update(time => {
      return Math.round(time * 5 * block - Math.sign(e.deltaY)) / 5 / block;
    });
  };

  /** @param {MouseEvent} e */
  const mousemove = e => {
    x = (e.clientX - rect.x) / rect.width;
    y = (e.clientY - rect.y) / rect.height;

    const yy = Math.round(y * 15 - $currentTick * block / 72 + Math.round($currentTick * block / 72)) / 15 + $currentTick * block / 72 / 15 - Math.round($currentTick * block / 72) / 15;
    if (Math.abs(y - yy) <= 1e-2) {
      y = yy;
    }
  };

  $: refs = new Array($chart.judgeLineList[$currentLineIndex].noteList.length);

  const colors = {
    click: '#0ac3ff',
    flick: '#fe4365',
    drag: '#f0ed69',
    hold: '#0ac3ff',
  };

  const addNote = type => {
    if (!editable) {
      return;
    }

    const time = $currentTick + (1 - y) * 15 * 72 / block;
    $chart.judgeLineList[$currentLineIndex].noteList = [
      ...$chart.judgeLineList[$currentLineIndex].noteList,
      {
        id: lastid + 1,
        type,
        startTime: time,
        endTime: time,
        relativeX: x * 2 - 1,
        side: 1,
        speed: 1,
        isFake: false,
      },
    ];
  };
  const addClick = () => addNote('click');
  const addFlick = () => addNote('flick');
  const addDrag = () => addNote('drag');
  const addHold = () => {
    if (holdid === -1) {
      holdid = lastid + 1;
      addNote('hold');
    }
  };
  const addHoldEnd = () => holdid = -1;

  onMount(() => {
    hotkeys('1', addClick);
    hotkeys('2', addFlick);
    hotkeys('3', addDrag);
    hotkeys('4', { keydown: true, keyup: false }, addHold);
    hotkeys('4', { keydown: false, keyup: true }, addHoldEnd);
  });

  onDestroy(() => {
    hotkeys.unbind('1', addClick);
    hotkeys.unbind('2', addFlick);
    hotkeys.unbind('3', addDrag);
    hotkeys.unbind('4', addHold);
    hotkeys.unbind('4', addHoldEnd);
  });
</script>

<style>
  .area {
    height: 480px;
    overflow: hidden;
    transform: translateZ(0);
    user-select: none;
  }

  .note {
    position: absolute;
    user-select: none;
  }
</style>

<svelte:window
  on:resize={updateRect}
  on:scroll={updateRect}
/>

<div
  class="area"
  style="
    background-image: linear-gradient(to bottom, black 5%, #f4f4f4 0%);
    background-position: 0 {rect.height * $currentTick * block / 72 / 15}px;
    background-size: 1px {rect.height / 15}px;
  "
  bind:this={ref}
  on:wheel={wheel}
  on:mousemove={mousemove}
  on:mouseenter={() => editable = true}
  on:mouseleave={() => editable = false}
>
  {#each $chart.judgeLineList[$currentLineIndex].noteList as note, i}
    <div
      class="note"
      style="
        width: {rect.width / 8}px;
        height: {note.type === 'hold' ? rect.height / 15 * (note.endTime - note.startTime) / 72 * block : rect.height / 50}px;
        transform: translate({(note.relativeX / 2 + 0.5 - 1 / 16) * rect.width}px, {rect.height * (1 - (note.endTime - $currentTick + $chart.timing.offset) * block / 72 / 15)}px);
        background: {colors[note.type]};
      "
      bind:this={refs[i]}
    />
  {/each}
</div>
<Slider bind:value={block} max={32} />
