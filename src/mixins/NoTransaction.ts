import { Account, TransactionInfo } from "@/types";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
@Options({
  computed: {
    ...mapGetters(["transactions", "accounts"]),
  },
  watch: {
    transactions(newVal: TransactionInfo[]) {
      if (newVal?.length == 0 && this.accounts?.length) {
        this.$notify({
          text: "You do not have transactions for the selected filter values",
          type: "info",
          duration: 3000,
        });
      }
    },
  },
})
export default class NoTransaction extends Vue {
  accounts?: Account[];
}
