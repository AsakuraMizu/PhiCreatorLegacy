<script>
  import { chart, apply, canUndo, undo, canRedo, redo } from './stores/chart';
  import { load } from './stores/project';

  const start = async () => {
    if (await window.api.project.startProject()) load({});
  };

  const test = () =>
    apply(
      Array.from({ length: 100 }).map((_, i) => ({
        op: 'replace',
        path: `/judgeLineList/0/noteList/${i}/type`,
        value: 4,
      }))
    );

  chart.watch((chart) => console.log(chart));
</script>

<template lang="pug">
  p
    button(on:click="{start}") Start
    button(on:click="{undo}" disabled="{!$canUndo}") Undo
    button(on:click="{redo}" disabled="{!$canRedo}") Redo
    button(on:click="{test}") Apply test patch
  ul
    +each("$chart.judgeLineList as line")
      li {line.id}
        ul
          +each("line.noteList as note")
            li id:{note.id} type:{note.type} time:{note.time}
</template>
