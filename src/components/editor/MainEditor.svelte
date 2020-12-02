<script>
  import { _ } from 'svelte-i18n';
  import {
    Tab,
    TabContent,
    Tabs,
  } from 'carbon-components-svelte/src/Tabs';
  import Lines from './Lines.svelte';
  import Notes from './Notes.svelte';
  import Events from './Events.svelte';
  import Bpms from './Bpms.svelte';
  import { currentTab } from '../../store';
</script>

<Lines />

<hr>

<Tabs bind:selected={$currentTab}>
  <Tab label={$_('notes')} />
  <Tab label={$_('events')} />
  <Tab label="Bpm" />
  <div slot="content">
    <TabContent>
      <Notes />
    </TabContent>
    <TabContent>
      <Events />
    </TabContent>
    <TabContent>
      <Bpms />
    </TabContent>
  </div>
</Tabs>
