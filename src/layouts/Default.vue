<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  name: "DefaultLayout",
})
export default class Default extends Vue {}
</script>
