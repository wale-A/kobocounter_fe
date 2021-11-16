<template>
  <div class="nbs-card" v-show="!hasAccounts">
    <img src="/img/assets/8.png" />
    <h3>You have not added any bank accounts</h3>
    <p>Bank accounts you add will be displayed here</p>
    <a href="profile.html">
      <button type="button" class="button" @click="addAccount">
        Add Bank Account
      </button>
    </a>
  </div>

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
.floating-button {
  padding: 2px 15px;
  width: unset !important;
  font-size: 2em;
  border-radius: 50%;
  position: fixed;
  top: 93%;
  left: 96%;
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
  .card {
    margin-top: 50px;
  }
}
</style>
