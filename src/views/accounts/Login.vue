<template>
  <header id="lg">
    <div class="logo" style="padding: 1em 0; margin-left: -0.5em">
      <img src="/img/assets/logo-blue.svg" style="width: 90%" />
    </div>
  </header>
  <section class="flex">
    <div class="bw">
      <div class="name">
        <div class="logo" style="padding: 1em 0; margin-left: -0.5em">
          <img src="/img/assets/logo-white.svg" style="width: 90%" />
        </div>
      </div>
      <div class="ilus"><img src="/img/assets/coin.png" /></div>
      <div class="text">
        <h2>Track Your Coins</h2>
        <p>Tired of wondering where all your money went?</p>
        <p>
          Track your spending and expenses across all your bank accounts with a
          single app.
        </p>
      </div>
      <!-- <div class="buttons">
        <router-link
          :to="{ name: 'Register' }"
          style="border-bottom: 1px solid black"
        >
          <button id="gs">Get Started</button>
        </router-link>
        <a href="#"><button id="login">Login</button></a>
      </div> -->
    </div>
    <div class="wb">
      <div>
        <h1 id="wb">Welcome</h1>
      </div>
      <div class="formBx">
        <form @submit.prevent="loginUser">
          <p>Enter your email address</p>
          <input type="Email" required name="Email" v-model="email" />
          <p>Enter your password</p>
          <!-- <input type="Password" required name="Password" minlength="8"  /> -->
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
              <a href="#"> Please use this link</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/layout/Header.vue";
import Password from "@/components/Password.vue";
import { mapActions } from "vuex";
import { storeUser } from "@/util";
import { User } from "@/types";
import { subscribeUser } from "@/_helpers/pushNotification";

@Options({
  components: {
    Header,
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
        .catch(() => {
          this.disabled = false;
          this.$notify({
            text: "Unable to login user",
            title: "Login failed",
            type: "error",
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
