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
          @editProfile="console.log('editing profile', $event)"
          @cancel.stop=""
          @deleteAccount="deleteExistingAccount($event)"
          @reAuthAccount="reAuthAccount($event)"
          @updatePassword="updateUserPassword($event)"
        ></component>
      </main>
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import EditProfile from "@/components/settings/EditProfile.vue";
import ManageAccounts from "@/components/settings/ManageAccounts.vue";
import { mapActions, mapGetters } from "vuex";
import Page from "@/components/layout/Page.vue";
import { Account, UpdatePasswordPayload } from "@/types";
import ChangePassword from "@/components/settings/ChangePassword.vue";

@Options({
  components: {
    EditProfile,
    ManageAccounts,
    ChangePassword,
    Page,
  },
  //   data() {},
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
  action = "edit-profile";
  components: Record<SettingsKeys, string> = {
    "edit-profile": "Edit Profile",
    "manage-accounts": "Manage Accounts",
    "change-password": "Change Password",
    "upgrade-plan": "Upgrade Plan",
  };
  routes: Record<SettingsKeys, string> = {
    "edit-profile": "/settings/edit-profile",
    "manage-accounts": "/settings/manage-accounts",
    "upgrade-plan": "/settings/upgrade-plan",
    "change-password": "/settings/change-password",
  };

  handleClick(key: SettingsKeys): void {
    this.action = key;
    this.$router.push(this.routes[key] || this.routes["edit-profile"]);
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
      this.deleteAccount(accountId)
        .then(() => this.getAccounts())
        .catch((e) => console.error({ e }));
    }
  }
  reAuthAccount(accountId: string): void {
    const refreshAccounts = (code: string) =>
      this.addAccount({ code }).then(() => this.getAccounts());

    this.generateAccountReAuthCode(accountId)
      .then((token) => {
        if (token) {
          this.$reAuthorise(
            {
              onSuccess: function (response: { code: string }) {
                console.log({ response });
                refreshAccounts(response.code);
              },
            },
            token
          );
        }
      })
      .catch((e) => console.error({ e }));
  }
  updateUserPassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): void {
    this.updatePassword({ oldPassword: currentPassword, newPassword }).then(
      () => window.location.reload()
    );
  }
}
type SettingsKeys =
  | "edit-profile"
  | "manage-accounts"
  | "upgrade-plan"
  | "change-password";
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
</style>
