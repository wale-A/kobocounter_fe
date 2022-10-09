<template>
  <header>
    <img src="/img/assets/logo.png" alt="logo" class="logo" />
    <div class="buttons">
      <router-link :to="{ name: 'Login' }"> Log in </router-link>
      <router-link :to="{ name: 'Register' }" class="alternate">
        Sign Up
      </router-link>
    </div>
  </header>
  <main>
    <h2>Attempting to verify account</h2>
    <Loader v-show="isLoading" />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapActions } from "vuex";
import Loader from "@/components/layout/Loader.vue";
@Options({
  components: {
    Loader,
  },
  mounted() {
    console.log({ route: this.$route });
    const verificationToken = this.$route.query.token;
    if (!verificationToken) {
      this.$notify({
        text: "Verification code is not vaid, Please confirm the url in the email",
        type: "error",
        duration: -1,
      });
    } else {
      this.verifyUserAccount(verificationToken);
    }
  },
  methods: {
    ...mapActions(["verifyAccount"]),
  },
})
export default class VerifyAccount extends Vue {
  verifyAccount!: (token: string) => Promise<void>;
  isLoading = false;

  verifyUserAccount(token: string): void {
    this.isLoading = true;
    this.verifyAccount(token)
      .then(() => {
        this.$notify({
          text: "Account verification was successful",
          type: "success",
        });
      })
      .catch((_) => {
        this.$notify({
          text: "Account verification failed. Please confirm verification url",
          type: "error",
          duration: -1,
        });
      })
      .finally(() => {
        this.isLoading = false;
        this.$router.push({ name: "Home" });
      });
  }
}
</script>

<style scoped lang="scss">
header {
  margin-bottom: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 6vh;
  padding: 0 3em 0 1em;
}

a {
  border: 1px solid rgb(0, 124, 255);
  border-radius: 10px;
  margin-top: 1.5em;
  padding: 0.4em 1.5em;
  font-size: 1em;
  margin-right: 1.5em;
}
a.alternate {
  background-color: rgb(0, 124, 255);
  color: white;
}
header .buttons {
  width: 15%;
}
header a {
  font-weight: unset;
  margin-top: 1em;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 600;
}
main {
  margin: 8% auto;
  text-align: center;

  img {
    top: 20% !important;
    left: 36% !important;
  }
}
</style>
