<template>
  <header id="lg">
    <div class="logo">
      <img src="/img/assets/logo.png" style="width: 30px" />
    </div>
    <div class="title">kobocounter</div>
  </header>
  <section>
    <div class="bw">
      <div class="name">
        <div class="logo">
          <img src="/img/assets/logo.png" style="width: 50px" />
        </div>
        <div class="title">kobocounter</div>
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
              :disabled="!(email && password)"
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
        </form>
      </div>
      <div class="forgot">
        <p>
          Forgot password?
          <a href="#"> Please use this link</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import Password from "@/components/Password.vue";
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";

@Options({
  components: {
    Header,
    Password,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginUser() {
      const loginButton = document.getElementById("login-button") as any;
      const nextUrl = this.$route.params.nextUrl;
      loginButton.disabled = true;

      this.$store.dispatch("loginUser", {
        email: this.email,
        password: this.password,
        callback: (e: Error, val: boolean, message?: string) => {
          loginButton.disabled = val;
          if (e) {
            return notify({
              text: "Unable to login user",
              title: "Login failed",
              type: "error",
            });
          }

          if (val) {
            if (nextUrl) {
              return router.push(nextUrl);
            }
            return router.push({ name: "Dashboard" });
          } else {
            return notify({
              text: message,
              title: "Login failed",
              type: "warning",
            });
          }
        },
      });
    },
  },
})
export default class Login extends Vue {}
</script>
