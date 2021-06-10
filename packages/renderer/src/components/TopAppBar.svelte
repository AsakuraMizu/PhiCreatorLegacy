<script>
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import IconifyIcon from '@iconify/svelte';
  import menu from '@iconify-icons/mdi/menu';
</script>

<template lang="pug">
  TopAppBar(dense variant="fixed")
    Row
      Section
        IconButton
          IconifyIcon(icon="{menu}")
        Title PhiCreator
      Section(align="end" toolbar) test
</template>
