<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <img :alt="alt" :src="src" id="bank-logo" style="height: 5em" />
    <!-- onerror="https://ui-avatars.com/api/?size=50&format=svg" -->
    <span class="mid-text darker-color">
      {{ date }}
      <br />
      {{ time }}
    </span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    date: String,
    time: String,
    src: String,
    alt: String,
  },
})
export default class Header extends Vue {}
</script>
