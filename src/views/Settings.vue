<template>
  <Page>
    <div class="page-body">
      <aside v-show="!onMobile">
        <ul v-for="key in Object.keys(components)" :key="key">
          <li
            :class="{ link: true, active: key === section }"
            @click="handleClick(key)"
          >
            {{ this.components[key] }}
          </li>
        </ul>
      </aside>
      <main>
        <component
          :is="selectedComponent"
          :accounts="accounts"
          :profile="username"
          :onMobile="onMobile"
          @editProfile.stop=""
          @cancel.stop=""
          @deleteAccount="deleteExistingAccount($event)"
          @reAuthAccount="reAuthAccount($event)"
          @updatePassword="updateUserPassword($event)"
          @accountAdded="accountAdded()"
        ></component>

        <Loader v-show="loading" />
      </main>
    </div>
    <FailedAccountNotification :accounts="accounts" />
  </Page>
</template>

<script lang="ts">
import Loader from "@/components/layout/Loader.vue";
import Page from "@/components/layout/Page.vue";
import ChangePassword from "@/components/settings/ChangePassword.vue";
import ManageAccounts from "@/components/settings/ManageAccounts.vue";
import UpgradePlan from "@/components/settings/UpgradePlan.vue";
import { Account, UpdatePasswordPayload } from "@/types";
import { Options, Vue } from "vue-class-component";
import { mapActions, mapGetters } from "vuex";

@Options({
  components: {
    UpgradePlan,
    ManageAccounts,
    ChangePassword,
    Page,
    Loader,
  },
  computed: {
    selectedComponent() {
      return this.components[this.section]?.replace(" ", "");
    },
    section() {
      return (
        this.$route.path
          .toLowerCase()
          .replace("settings", "")
          .replaceAll("/", "") || this.action
      );
    },
    ...mapGetters(["accounts", "username"]),
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
  created() {
    this.getAccounts();
  },
  methods: {
    ...mapActions([
      "getAccounts",
      "deleteAccount",
      "generateAccountReAuthCode",
      "addAccount",
      "updatePassword",
    ]),
  },
})
export default class Settings extends Vue {
  generateAccountReAuthCode!: (accountId: string) => Promise<string>;
  deleteAccount!: (accountId: string) => Promise<void>;
  getAccounts!: () => Promise<void>;
  addAccount!: ({ code }: { code: string }) => Promise<void>;
  updatePassword!: (payload: UpdatePasswordPayload) => Promise<void>;
  $reAuthorise!: any;
  //({onSuccess: (response: {code: string}) => any}, token: string) => void;

  onMobile?: boolean;
  accounts?: Account[];
  username?: string;
  section?: string;
  selectedComponent?: string;
  action = "manage-accounts";
  loading = false;
  components: Record<SettingsKeys, string> = {
    "manage-accounts": "Manage Accounts",
    "change-password": "Change Password",
    "upgrade-plan": "Upgrade Plan",
  };
  routes: Record<SettingsKeys, string> = {
    "manage-accounts": "/settings/manage-accounts",
    "upgrade-plan": "/settings/upgrade-plan",
    "change-password": "/settings/change-password",
  };

  handleClick(key: SettingsKeys): void {
    this.action = key;
    this.$router.push(this.routes[key] || this.routes["manage-accounts"]);
  }
  deleteExistingAccount(accountId: string): void {
    const account = (this.accounts || []).find((x) => x.id == accountId);
    if (!account) {
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete ${account.bankName} - ${account.accountNumber}`
      )
    ) {
      this.loading = true;
      this.deleteAccount(accountId)
        .then(() => this.getAccounts().then(() => (this.loading = false)))
        .catch((e) => {
          this.loading = false;
        });
    }
  }
  reAuthAccount(accountId: string): void {
    this.loading = true;
    const removeLoader = () => {
      this.loading = false;
    };

    const refreshAccounts = (code: string) =>
      this.addAccount({ code }).then(() =>
        this.getAccounts().then(() => {
          this.$notify({
            text: "Account re-connection was successful",
            type: "success",
          });
          removeLoader();
        })
      );

    this.generateAccountReAuthCode(accountId)
      .then((token) => {
        if (token) {
          this.$reAuthorise(
            {
              onSuccess: function (response: { code: string }) {
                refreshAccounts(response.code);
              },
              onEvent: function (event: string, data: any) {
                removeLoader();
                if (event == "ERROR") {
                  throw new Error(data);
                }
              },
            },
            token
          );
        }
      })
      .catch((e) => {
        removeLoader();
        this.$notify({
          text: "Unable to reconnect account. Please retry later",
          type: "error",
          duration: 10000,
        });
      });
  }

  updateUserPassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): void {
    this.loading = true;
    this.updatePassword({ oldPassword: currentPassword, newPassword }).then(
      () => {
        this.loading = false;
        window.location.reload();
      }
    );
  }

  accountAdded(): void {
    window.location.reload();
  }
}

type SettingsKeys = "manage-accounts" | "upgrade-plan" | "change-password";
</script>

<style scoped lang="scss">
.page-body {
  height: 86%;
  display: flex;
  padding: 2% 1%;
}
aside {
  width: fit-content;
  border-right: 1px solid grey;

  ul {
    list-style: none;

    li {
      margin: 1em auto;
      padding: 1em;
      padding-right: 2em;
      cursor: pointer;
    }
    li.active {
      background-color: #007cffaa;
    }
  }
}
main {
  width: 84%;
  margin: 2% 8%;
}
.loader {
  height: unset !important;
}
</style>
