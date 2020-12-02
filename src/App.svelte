<script>
  import { _ } from 'svelte-i18n';
  import {
    Header,
    HeaderUtilities,
    Content,
  } from 'carbon-components-svelte/src/UIShell';
  import {
    Accordion,
    AccordionItem,
  } from 'carbon-components-svelte/src/Accordion';
  import Music from './components/Music.svelte';
  import MainEditor from './components/editor/MainEditor.svelte';
  import Options from './components/Options.svelte';
  import Preview from './components/Preview.svelte';
  import RawJson from './components/RawJson.svelte';

  let isSideNavOpen = true;
</script>

<Header company="PhiX Project" platformName="PhiCreator" bind:isSideNavOpen>
  <HeaderUtilities>
    <Music />
  </HeaderUtilities>
</Header>

<Options isOpen={isSideNavOpen} />

<Content>
  <Accordion>
    <AccordionItem open title={$_('maineditor')}>
      <MainEditor />
    </AccordionItem>
    <AccordionItem open title={$_('preview')}>
      <Preview />
    </AccordionItem>
    <AccordionItem open title={$_('rawjson')}>
      <RawJson />
    </AccordionItem>
  </Accordion>
</Content>
