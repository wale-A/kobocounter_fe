<template>
  <div class="empty">
    <img
      src="/img/assets/no-transaction.svg"
      alt="no-transactions"
      class="empty__icon"
    />
    <p class="empty__message">Select a category to see more details</p>
  </div>
</template>

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
