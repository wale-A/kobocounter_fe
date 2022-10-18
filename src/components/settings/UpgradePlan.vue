<template>
  <div class="title"><h3>Upgrade Plan</h3></div>
  <div class="edit-profile__body">
    <h3>Enjoy the app for free......for now 🦹🏿‍♂️😈</h3>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({})
export default class UpgradePlan extends Vue {}
</script>

<style scoped lang="scss">
.edit-profile {
  @at-root #{&}__body {
    margin-top: 2em;
  }
  @at-root #{&}__actions {
    margin-top: 1em;
    input {
      margin: 1.5em 0;
    }
  }
}

@media (min-width: 1200px) {
  .edit-profile {
    @at-root #{&}__actions {
      input {
        margin-right: 3em;
      }
    }
  }
}
</style>
