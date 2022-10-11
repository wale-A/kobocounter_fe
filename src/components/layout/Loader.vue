<template>
  <img
    style="width: 30%; position: absolute; top: 15%; left: 40%"
    src="/img/assets/loading.gif"
    alt="loading image"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({})
export default class Loader extends Vue {}
</script>
