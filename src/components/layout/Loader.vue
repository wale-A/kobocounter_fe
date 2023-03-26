<template>
  <div class="loader">
    <svg-icon class="loader__icon" :src="iconPath" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    iconPath: {
      type: String,
      default: "/img/assets/svg/loading.svg",
    },
  },
})
export default class Loader extends Vue {
  iconPath!: string;
}
</script>

<style lang="scss" scoped>
.loader {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  @at-root #{&}__icon {
    width: 300px;
    height: 300px;
    color: blue;
  }
}
</style>
