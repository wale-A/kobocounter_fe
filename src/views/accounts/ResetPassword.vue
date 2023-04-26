<template>
  <div class="wb">
    <section v-if="!resetToken" class="formBx">
      <h1 id="wb">Forgot Password</h1>
      <form @submit.prevent="sendForgotPasswordEmail">
        <p>Enter your email address</p>
        <input type="email" required name="Email" v-model="email" />

        <div class="create">
          <input type="submit" value="Submit" id="login-button" />
        </div>
      </form>
    </section>

    <section v-else class="wb">
      <h1 id="wb">Reset Password</h1>
      <form @submit.prevent="initiateResetPassword">
        <p>Enter your new password</p>
        <Password v-model:password="password" />
        <div class="create">
          <input
            type="submit"
            value="Submit"
            id="login-button"
            :disabled="disabled || valid"
          />
        </div>
      </form>
    </section>
    <Loader v-show="isLoading" />
  </div>
</template>

<script lang="ts">
import Loader from "@/components/layout/Loader.vue";
import Password from "@/components/Password.vue";
import { Options, Vue } from "vue-class-component";
import { mapActions } from "vuex";
@Options({
  components: {
    Loader,
    Password,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  mounted() {
    this.resetToken = this.$route.query.token;
  },
  methods: {
    ...mapActions(["requestPasswordReset", "resetPassword"]),
  },
  computed: {
    valid() {
      console.log({
        email: this.email,
        password: this.password,
        token: this.resetToken,
      });
      return this.email || (this.password && this.resetToken);
    },
  },
})
export default class ResetPassword extends Vue {
  requestPasswordReset!: (email: string) => Promise<void>;
  resetPassword!: ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => Promise<void>;
  isLoading = false;
  resetToken = "";
  email = "";
  password = "";
  valid = false;
  disabled = false;

  sendForgotPasswordEmail(): void {
    console.log("sending forgot password email: ", { email: this.email });
    this.isLoading = true;
    this.disabled = true;
    this.requestPasswordReset(this.email)
      .then(() => {
        this.$notify({
          text: "Please check your email to proceed.",
          type: "success",
        });
      })
      .catch((_) => {
        this.$notify({
          text: "Unable to initiate password reset. Please retry",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        this.disabled = false;
        this.isLoading = false;
        this.$router.push({ name: "Home" });
      });
  }

  initiateResetPassword(): void {
    this.isLoading = true;
    this.disabled = true;
    this.resetPassword({ token: this.resetToken, password: this.password })
      .then(() => {
        this.$notify({
          text: "Password reset successful.",
          type: "success",
        });
      })
      .catch((_) => {
        this.$notify({
          text: "Unable to reset password. Please retry",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        this.disabled = false;
        this.isLoading = false;
        this.$router.push({ name: "Login" });
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

.loader {
  height: unset !important;
}
</style>
