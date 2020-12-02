<script>
  import { onDestroy, onMount } from 'svelte';
  import JSONEditor from 'jsoneditor';
  import 'jsoneditor/dist/jsoneditor.css';
  import { chart } from '../store';

  let container;
  let unsubscribe;

  /** @type{JSONEditor} */
  let editor;

  let flag = 0;

  onMount(() => {
    editor = new JSONEditor(container, {
      mode: 'code',
      modes: ['tree', 'code'],
      onChange: () => {
        try {
          ++flag;
          chart.set(editor.get());
        } catch { /** */ }
      },
    }, $chart);
    unsubscribe = chart.subscribe(chart => {
      if (flag > 0) {
        --flag;
      } else {
        editor.set(chart);
      }
    });
  });

  onDestroy(() => {
    unsubscribe();
    editor.destroy();
  });
</script>

<div style="height: 800px" bind:this={container} />
