<template>
  <img
    v-if="loading"
    style="width: 30%; position: absolute; top: 15%; left: 40%"
    src="/img/assets/loading.gif"
    alt="loading image"
  />
  <slot v-else />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  loading: {
    type: Boolean,
    default: false,
  },
})
export default class Wrap extends Vue {
  loading!: boolean;
}
</script>
