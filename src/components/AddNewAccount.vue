<template>
  <section class="no-account" v-show="!hasAccounts">
    <img src="/img/assets/no-accounts.svg" />
    <h3>You have not added any bank accounts</h3>
    <p>Bank accounts you add will be displayed here</p>
    <form @submit.prevent="addNewAccount">
      <input type="submit" value="Add Bank Account" />
    </form>
  </section>
  <AddButton :title="'Add an account'" @add="addNewAccount" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AddButton from "./AddButton.vue";
import { mapActions } from "vuex";

@Options({
  components: {
    AddButton,
  },
  props: {
    hasAccounts: Boolean,
  },
  methods: {
    ...mapActions(["getAccounts", "addAccount"]),
  },
})
export default class AddNewAccount extends Vue {
  getAccounts!: () => Promise<void>;
  addAccount!: ({ code }: { code: string }) => Promise<void>;

  addNewAccount(): void {
    const addAccountFn = (code: string) =>
      this.addAccount({ code }).then(() => this.getAccounts());
    const accountAdded = () => this.$emit("accountAdded");

    const options = {
      onSuccess: function (response: { code: string }) {
        addAccountFn(response.code);
        // accountAdded();
      },
    };
    this.$launchMono(options);
  }
}
</script>

<style scoped>
.no-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 2% 10%;
}
.no-account img {
  width: 60%;
}
.no-account h3 {
  margin-top: 1em;
  margin-bottom: 0.4em;
}
.no-account input {
  margin: 2em auto;
}

@media screen and (max-width: 900px) {
  .no-account form {
    width: 100%;
  }
  .no-account {
    padding-top: 15%;
  }
  .no-account img {
    width: 100%;
  }
}
</style>
