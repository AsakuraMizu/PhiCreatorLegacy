<script>
  import { _, locale, locales } from 'svelte-i18n';
  import {
    Select,
    SelectItem,
  } from 'carbon-components-svelte/src/Select';
  import { SideNav } from 'carbon-components-svelte/src/UIShell';
  import { Form } from 'carbon-components-svelte/src/Form';
  import { TextInput } from 'carbon-components-svelte/src/TextInput';
  import { FileUploader } from 'carbon-components-svelte/src/FileUploader';
  import { NumberInput } from 'carbon-components-svelte/src/NumberInput';
  import { Slider } from 'carbon-components-svelte/src/Slider';
  import { title, difficulty, music, background, currentTime, currentTick, rate, musicVolume, fxVolume } from '../store';
  export let isOpen = true;
</script>

<SideNav {isOpen} style="padding: 15px 7px">
  <h3>{$_('options')}</h3>
  <br>
  <Form>
    <Select labelText={$_('language')} bind:selected={$locale}>
      {#each $locales as l}
        <SelectItem value={l} text={$_(l)} />
      {/each}
    </Select>
    <TextInput
      bind:value={$title}
      labelText={$_('title')}
      placeholder={$_('entertitle')}
    />
    <TextInput
      bind:value={$difficulty}
      labelText={$_('difficulty')}
      placeholder={$_('enterdifficulty')}
    />
    <NumberInput
      bind:value={$currentTime}
      label={$_('time')}
    />
    <NumberInput
      value={$currentTick}
      label={$_('tick')}
      disabled
    />
    <NumberInput
      bind:value={$rate}
      label={$_('rate')}
    />
    <Slider
      bind:value={$musicVolume}
      labelText={$_('musicvolume')}
      min={0}
      max={1}
      step={0.01}
      hideTextInput
    />
    <Slider
      bind:value={$fxVolume}
      labelText={$_('fxvolume')}
      min={0}
      max={1}
      step={0.01}
      hideTextInput
    />
    <FileUploader
      buttonLabel={$_('selectmusic')}
      accept={["audio/*"]}
      status="complete"
      on:change={({ target }) => music.from(target.files[0])}
    />
    <FileUploader
      buttonLabel={$_('selectbackground')}
      accept={["image/*"]}
      status="complete"
      on:change={({ target }) => background.from(target.files[0])}
    />
  </Form>
</SideNav>
