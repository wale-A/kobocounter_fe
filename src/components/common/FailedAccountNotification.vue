<template>
  <br />
</template>

<script lang="ts">
import { Account } from "@/types";
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    accounts: Array,
  },
  watch: {
    accounts(newVal: Account[]) {
      if (newVal.some((x) => x.status == "FAILED")) {
        this.$notify({
          text: "You have account(s) in need of attention. Please manage your accounts in the <a href='/settings'>Settings</a> section",
          type: "warn",
          duration: -1,
        });
      }
    },
  },
})
export default class FailedAccountNotification extends Vue {}
</script>
