<template>
  <div class="empty">
    <img :src="iconUrl" alt="no-transactions" class="empty__icon" />
    <p class="empty__message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    iconUrl: {
      type: String,
      default: "/img/assets/no-transaction.svg",
    },
    message: {
      type: String,
      default: "Select a category to see more details",
    },
  },
})
export default class Empty extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @at-root #{&}__icon {
    margin-bottom: 22px;
  }
}
</style>
