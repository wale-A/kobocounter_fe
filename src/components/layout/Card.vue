<template>
  <div class="card">
    <div class="card__header">
      <div class="card__title">
        <p class="card__title-text">
          {{ title }} <small>{{ subtitle }}</small>
        </p>
        <slot name="action" />
      </div>
    </div>
    <div class="card__body">
      <Loader v-if="loading" :iconPath="'/img/assets/svg/loading-icons.svg'" />
      <slot v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Loader from "./Loader.vue";

@Options({
  components: {
    Loader,
  },
  props: {
    title: String,
    subtitle: String,
    loading: {
      type: Boolean,
      default: false,
    },
    error: Error,
  },
})
export default class Card extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.card {
  box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;

  @include for-size(tablet-landscape-up) {
    padding: 13px 17px;
    box-shadow: 0px 0px 15px 5px rgb(54 65 86 / 10%);
  }

  @at-root #{&}__header {
    margin-bottom: 13px;
  }

  @at-root #{&}__title {
    display: flex;
    align-content: space-between;
    flex-direction: row;
    justify-content: space-between;
  }

  @at-root #{&}__title-text {
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #2a2a2a;
    @include for-size(tablet-landscape-up) {
      font-size: 16px;
      line-height: 22px;
    }

    small {
      font-size: 12px;
      font-weight: 400;
    }
  }

  @at-root #{&}__body {
    flex: 1;
  }
}
</style>
