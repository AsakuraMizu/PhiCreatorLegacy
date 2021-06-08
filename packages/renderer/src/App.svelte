<script lang="ts">
  import logo from './assets/svelte.png';
  import Counter from './lib/Counter.svelte';
  import Versions from './lib/Versions.svelte';
</script>

<template lang="pug">
  main
    img(src="{logo}" alt="Svelte Logo")
    h1 Hello Electron!
    Counter
    p Learn Svelte at: #[a(href="https://svelte.dev/") svelte.dev]
    p Source code: #[a(href="https://github.ccom/AsakuraMizu/electron-vite-svelte-template") AsakuraMizu/electron-vite-svelte-template]
    Versions
</template>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  img {
    height: 16rem;
    width: 16rem;
  }
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }
  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }
  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
    p {
      max-width: none;
    }
  }
</style>
