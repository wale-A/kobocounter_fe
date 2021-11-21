<template>
  <section class="no-account" v-show="!hasAccounts">
    <img src="/img/assets/8.png" />
    <h3>You have not added any bank accounts</h3>
    <p>Bank accounts you add will be displayed here</p>
    <form @submit.prevent="addAccount">
      <input type="submit" value="Add Bank Account" />
    </form>
  </section>
  <button class="floating-button" @click="addAccount" title="Add an account">
    +
  </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    hasAccounts: Boolean,
  },
  methods: {
    addAccount() {
      const fn = (code: string) => this.$store.dispatch("addAccount", { code });
      const options = {
        onSuccess: function (response: { code: string }) {
          fn(response.code);
        },
      };
      this.$launchMono(options);
    },
  },
})
export default class AddNewAccount extends Vue {}
</script>

<style scoped>
.no-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 8% 10%;
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
.floating-button {
  padding: 2px 15px;
  width: unset !important;
  font-size: 2em;
  border-radius: 50%;
  position: fixed;
  top: 93%;
  left: 95%;
  transition: all 0.2s ease-in 0s;
  z-index: 9999;
  cursor: pointer;
  margin: 0;
  color: white;
  background-color: #007cff;
  border-color: transparent;
}

.card {
  text-align: center;
  margin-top: 90px;
}

@media screen and (max-width: 900px) {
  .floating-button {
    top: 84%;
    left: 84%;
  }
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
