<template>
  <div class="wb">
    <div>
      <h1 id="wb">Welcome</h1>
    </div>
    <div class="formBx">
      <form @submit.prevent="loginUser">
        <p>Enter your email address</p>
        <input type="Email" required name="Email" v-model="email" />
        <p>Enter your password</p>
        <Password v-model:password="password" />
        <div class="create">
          <input
            type="submit"
            value="Login"
            id="login-button"
            :disabled="disabled || !valid"
          />
          <div class="question">
            <p>
              Don't have an account?
              <router-link :to="{ name: 'Register' }" class="accent-color"
                >Sign up here</router-link
              >
            </p>
          </div>
        </div>
        <div class="forgot">
          <p>
            Forgot password?
            <a href="#"> Click here</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Password from "@/components/Password.vue";
import { mapActions } from "vuex";
import { storeUser } from "@/util";
import { User } from "@/types";
import { subscribeUser } from "@/_helpers/pushNotification";

@Options({
  components: {
    Password,
  },
  data() {
    return {
      email: "",
      password: "",
      disabled: false,
    };
  },
  methods: {
    ...mapActions(["login"]),
    async loginUser() {
      this.disabled = true;

      this.login({
        email: this.email,
        password: this.password,
      })
        .then((user: User) => {
          storeUser(user);
          subscribeUser();

          const redirect = this.$route.params.nextUrl;
          if (redirect) {
            this.$router.push(redirect);
            return;
          }
          this.$router.push({ name: "Dashboard" });
        })
        .catch((e: Error) => {
          this.disabled = false;
          this.$notify({
            text: e.message,
            title: "Login failed",
            type: "error",
            duration: -1,
          });
        });
    },
  },
  computed: {
    valid() {
      return this.email && this.password;
    },
  },
})
export default class Login extends Vue {}
</script>

<style scoped>
form p {
  margin-top: 1.5em;
}
</style>
