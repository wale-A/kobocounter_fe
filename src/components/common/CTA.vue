<template>
  <section class="cta">
    <img :src="iconPath" class="cta__icon" />
    <h3 class="cta__title">{{ title }}</h3>
    <p class="cta__subtitle">{{ subtext }}</p>
    <button class="cta__action" @click="$emit('action')">
      {{ buttonLabel }}
    </button>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    iconPath: {
      type: String,
      default: "/img/assets/no-accounts.svg",
    },
    title: String,
    subtext: String,
    buttonLabel: String,
  },
})
export default class CTA extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding-top: 1%;

  @include for-size(tablet-landscape-up) {
    padding: 2% 10%;
    height: 85vh;
  }

  @at-root #{&}__icon {
    width: 100%;
    margin-bottom: 24px;

    @include for-size(tablet-landscape-up) {
      width: 220px;
      height: 100px;
    }
  }

  @at-root #{&}__title {
    font-weight: 700;
    font-size: 24px;
    line-height: 33px;
    margin-bottom: 0.4em;
    color: #2a2a2a;
  }

  @at-root #{&}__subtitle {
    font-size: 16px;
    line-height: 22px;
    color: rgba(42, 42, 42, 0.85);
    margin-bottom: 13px;
  }

  @at-root #{&}__action {
    width: 70%;
    padding: 9px 12px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    transition: all 0.2s ease-in 0s;
    cursor: pointer;
    margin: 0;
    color: white;
    background-color: #007cff;
    border-color: transparent;

    @include for-size(tablet-landscape-up) {
      width: initial;
    }
  }
}
</style>
