import { TransactionInfo } from "@/types";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
@Options({
  computed: {
    ...mapGetters(["transactions"]),
  },
  watch: {
    transactions(newVal: TransactionInfo[]) {
      if (!newVal.length) {
        this.$notify({
          text: "You do not have transactions for the selected date period",
          type: "info",
          duration: -1,
        });
      }
    },
  },
})
export default class NoTransaction extends Vue {}
