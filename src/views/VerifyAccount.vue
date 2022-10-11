<template>
  <header>
    <img src="/img/assets/logo.png" alt="logo" class="logo" />
  </header>
  <main>
    <h3>Attempting to verify account</h3>
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

main {
  margin: 5% auto;
  text-align: center;

  img {
    top: 15% !important;
    left: 30% !important;
  }
}
</style>
