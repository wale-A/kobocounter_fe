<template>
  <div
    class="account-item"
    :style="{
      'border-color':
        status === 'AVAILABLE'
          ? '#00FF00'
          : status === 'PROCESSING'
          ? '#DADA06'
          : '#FF0000',
      cursor: status === 'FAILED' ? 'pointer' : 'unset',
    }"
    @click.stop="updateAccount"
  >
    <p
      class="material-icons"
      style="
        margin-right: 20px;
        cursor: pointer;
        color: red;
        margin: 0;
        align-self: flex-end;
        position: absolute;
      "
      @click.stop="deleteAccount"
    >
      delete
    </p>
    <div style="text-align: start; display: flex">
      <img
        :alt="`${bank.toLowerCase()} logo`"
        :src="`/img/banks/${bank.toLowerCase()}.svg`"
      />
      <div class="content">
        <span>
          Number: {{ accountNumber }} <br />
          Balance: {{ balance?.toLocaleString() || "-" }} <br />
          Currency: {{ currency }} <br />
          Type: {{ type.replace(/_/g, " ") }} <br />
          Status: {{ status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    bank: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    balance: Number,
    currency: String,
    type: String,
    status: {
      type: String,
      required: true,
    },
  },
  methods: {
    updateAccount() {
      if (this.status === "FAILED") {
        const updateAccountFn = (code: string) =>
          this.$store.dispatch("addAccount", { code });

        this.$store.dispatch("generateAccountReAuthCode", {
          accountId: this.id,
          callback: (token?: string) => {
            if (token) {
              this.$reAuthorise(
                {
                  onSuccess: function (response: { code: string }) {
                    updateAccountFn(response.code);
                  },
                },
                token
              );
            }
          },
        });
      }
    },
    deleteAccount() {
      const response = confirm(
        `Do you want to delete this account for ${this.bank}`
      );
      if (response) {
        this.$store.dispatch("deleteAccount", {
          accountId: this.id,
          callback: (e: Error | null) => {
            if (!e) return location.reload();

            notify({
              text: "Unable to delete account, please retry",
              type: "error",
            });
          },
        });
      }
    },
  },
})
export default class AccountItem extends Vue {}
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.account-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid;
  border-radius: 10px;
  margin-bottom: 15px;
  align-items: flex-start;
}
.account-item:hover {
  border-width: 2px;
}

@media screen and (max-width: 700px) {
  img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
}
</style>
