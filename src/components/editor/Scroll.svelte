<script>
  import { getContext, onDestroy, onMount, tick } from 'svelte';
  import { Slider } from 'carbon-components-svelte/src/Slider';
  import Moveable from 'moveable';
  import Selecto from 'selecto';
  import hotkeys from 'hotkeys-js';

  import { chart, currentLineIndex, currentTime, currentTick } from '../../store';

  let { selectedIds } = getContext('selectedIds');

  /** @type {HTMLDivElement} */
  let ref;

  let block = 1;
  let editable = false;
  let x = 0;
  let y = 0;
  let holdindex = -1;

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
      if (block === 0) {
        return time;
      } else {
        return Math.round(time * 5 * block - Math.sign(e.deltaY)) / 5 / block;
      }
    });
    tick().then(() => moveable.updateTarget());
  };

  /** @param {MouseEvent} e */
  const mousemove = e => {
    x = (e.clientX - rect.x) / rect.width;
    y = (e.clientY - rect.y) / rect.height;

    const yy = Math.round(y * 15 - $currentTick * block / 72 + Math.round($currentTick * block / 72)) / 15 + $currentTick * block / 72 / 15 - Math.round($currentTick * block / 72) / 15;
    if (Math.abs(y - yy) <= 1e-2) {
      y = yy;
    }

    if (holdindex !== -1) {
      $chart.judgeLineList[$currentLineIndex].noteList[holdindex].endTime = $currentTick + (1 - y) * 15 * 72 / block;
    }
  };

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
    if (holdindex === -1) {
      holdindex = $chart.judgeLineList[$currentLineIndex].noteList.length;
      addNote('hold');
    }
  };
  const addHoldEnd = () => holdindex = -1;

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

  /** @type {HTMLDivElement[]} */
  let targets = [];
  /** @type {Selecto} */
  let selecto;
  /** @type {Moveable} */
  let moveable;

  let refs = [];

  /** @param {string} px */
  function parsePx(px) {
    return Number.parseFloat(/(.*)px/.exec(px)[1]);
  }

  onMount(() => {
    selecto = new Selecto({
      dragContainer: ref,
      selectableTargets: ['.note'],
      toggleContinueSelect: 'ctrl',
    }).on('dragStart', e => {
      const target = e.inputEvent.target;
      if (moveable.isMoveableElement(target) || targets.some(t => t === target)) {
        e.stop();
      }
    }).on('select', e => {
      targets = e.selected;
      moveable.target = targets;
      $selectedIds = targets.map(t => $chart.judgeLineList[$currentLineIndex].noteList[refs.findIndex(e => e === t)].id);
    }).on('selectEnd', e => {
      if (e.isDragStart) {
        e.inputEvent.preventDefault();
        setTimeout(() => moveable.dragStart(e.inputEvent));
      }
    });

    moveable = new Moveable(ref, {
      draggable: true,
    }).on('clickGroup', e => {
      selecto.clickTarget(e.inputEvent, e.inputTarget);
    }).on('dragStart', ({ set, target }) => {
      const [, x, y ] = /translate\((.*?), (.*?)\)/.exec(target.style.transform);
      set([parsePx(x), parsePx(y)]);
    }).on('drag', ({ beforeTranslate, target }) => {
      const [ x, y ] = beforeTranslate;
      const index = refs.findIndex(e => e === target);
      const relativeX = (x + parsePx(target.style.width) / 2) / rect.width * 2 - 1;
      const endTime = (rect.height - y) / (rect.height / 15) / block * 72 + $currentTick;
      const n = $chart.judgeLineList[$currentLineIndex].noteList[index];
      $chart.judgeLineList[$currentLineIndex].noteList[index] = {
        ...n,
        relativeX,
        startTime: n.startTime + (endTime - n.endTime),
        endTime,
      };
      tick().then(() => moveable.updateTarget());
    }).on('dragGroupStart', ({ events }) => {
      events.forEach(({ set, target }) => {
        const [, x, y ] = /translate\((.*?), (.*?)\)/.exec(target.style.transform);
        set([parsePx(x), parsePx(y)]);
      });
    }).on('dragGroup', ({ events }) => {
      events.forEach(({ beforeTranslate, target }) => {
        const [ x, y ] = beforeTranslate;
        const index = refs.findIndex(e => e === target);
        const relativeX = (x + parsePx(target.style.width) / 2) / rect.width * 2 - 1;
        const endTime = (rect.height - y) / (rect.height / 15) / block * 72 + $currentTick;
        const n = $chart.judgeLineList[$currentLineIndex].noteList[index];
        $chart.judgeLineList[$currentLineIndex].noteList[index] = {
          ...n,
          relativeX,
          startTime: n.startTime + (endTime - n.endTime),
          endTime,
        };
      });
      tick().then(() => moveable.updateTarget());
    });
  });

  $: {
    targets = $selectedIds.map(id => refs[$chart.judgeLineList[$currentLineIndex].noteList.findIndex(n => n.id === id)]);
    if (moveable) {
      moveable.target = targets;
    }
  }

  onDestroy(() => {
    selecto.destroy();
    moveable.destroy();
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
        transform: translate({(note.relativeX / 2 + 0.5 - 1 / 16) * rect.width}px, {rect.height * (1 - (note.endTime - $currentTick) * block / 72 / 15)}px);
        background: {colors[note.type]};
      "
      bind:this={refs[i]}
    />
  {/each}
</div>
<Slider bind:value={block} min={0} max={32} />
