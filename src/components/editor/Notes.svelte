<script>
  import {
    Grid,
    Row,
    Column,
  } from 'carbon-components-svelte/src/Grid';
  import NoteList from './NoteList.svelte';
  import NoteEdit from './NoteEdit.svelte';
  import Scroll from './Scroll.svelte';
  import { chart, currentLineIndex, currentNoteIndex } from '../../store';
</script>

{#if $currentLineIndex in $chart.judgeLineList}
  <Grid narrow>
    <Row>
      <Column>
        <Scroll />
      </Column>
      <Column>
        <NoteList />
      </Column>
    </Row>
  </Grid>
  <br>
  {#if $currentNoteIndex in $chart.judgeLineList[$currentLineIndex].noteList}
    <NoteEdit />
  {/if}
{/if}
