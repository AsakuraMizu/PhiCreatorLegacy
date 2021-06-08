<template lang="pug">
  h2 Versions
  ul
    +each('Object.entries(window.api.versions) as [lib, version]')
      li #[strong {lib}]: v{version}
</template>
