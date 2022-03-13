<template>
  <main>
    <slot />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  name: "DefaultLayout",
})
export default class Default extends Vue {}
</script>
