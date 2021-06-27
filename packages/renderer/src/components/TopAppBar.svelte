<script>
  import { AppBar, Button } from 'svelte-materialify';
  import IconifyIcon from '@iconify/svelte';
  import menu from '@iconify-icons/mdi/menu';
</script>

<template lang="pug">
  AppBar()
    div(slot="icon")
      Button(depressed)
        IconifyIcon(icon="{menu}")
    span(slot="title") PhiCreator
    div(style="flex-grow:1")
    Button test
</template>
