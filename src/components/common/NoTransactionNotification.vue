<template>
  <br />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    transactionCount: Number,
  },
  watch: {
    transactionCount(newVal: number) {
      if (!newVal) {
        this.$notify({
          text: "You do not have transactions for the selected date period",
          type: "info",
          duration: 5000,
        });
      }
    },
  },
})
export default class NoTransactionNotification extends Vue {}
</script>
