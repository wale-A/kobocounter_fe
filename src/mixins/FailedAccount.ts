import { Account } from "@/types";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
@Options({
  computed: {
    ...mapGetters(["accounts"]),
  },
  watch: {
    accounts(newVal: Account[]) {
      if (
        newVal &&
        newVal.some((x) => x.status == "FAILED") &&
        !this.failedAccountNotificationClicked &&
        !["ManageAccounts", "AllSettings"].includes(this.$route.name)
      ) {
        this.failedAccountNotificationClicked = true;
        this.$notify({
          text: "Your account is in need of attention. Please manage your account in the <a href='/settings'>Settings</a> section",
          type: "warn",
          duration: 3000,
        });
      }
    },
  },
})
export default class FailedAccount extends Vue {
  failedAccountNotificationClicked = false;
}
