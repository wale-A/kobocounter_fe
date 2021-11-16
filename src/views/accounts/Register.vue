<template>
  <section class="flex">
    <div class="bw">
      <div class="name">
        <div class="logo">
          <img src="/img/assets/logo.png" />
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
        <router-link :to="{ name: 'Register' }">
          <button id="gs">Get Started</button>
        </router-link>
        <router-link :to="{ name: 'Login' }" class="accent-color"
          ><button id="login">Login</button></router-link
        >
      </div> -->
    </div>
    <div class="w">
      <div>
        <h1>Sign up</h1>
      </div>
      <div class="formBx">
        <form @submit.prevent="registerUser">
          <p>Hola! What's your name?</p>
          <input type="text" required name="Name" v-model="name" />
          <p>Enter your email address</p>
          <input type="email" required name="Email" v-model="email" />
          <p>Choose a Password (min. of 8 characters)</p>
          <Password v-model:password="password" />
          <p>
            <input type="checkbox" v-model="acceptPreCondition" required /> I
            accept the
            <a href="#"> Terms & Conditions </a>
            and
            <a href="#"> Privacy Policy</a>
          </p>
          <div class="create">
            <input
              type="submit"
              value="Create Account"
              id="register-button"
              :disabled="!(name && email && password && acceptPreCondition)"
            />
            <div class="question">
              <p>
                Already have an account?
                <router-link :to="{ name: 'Login' }" class="accent-color"
                  >Login here</router-link
                >
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Options } from "vue-class-component";
import Header from "@/components/Header.vue";
import router from "@/router";
import { notify } from "@kyvg/vue3-notification";
import Password from "@/components/Password.vue";

@Options({
  components: {
    Header,
    Password,
  },
  data() {
    return {
      email: "",
      name: "",
      password: "",
      acceptPreCondition: false,
    };
  },
  methods: {
    async registerUser() {
      const registerButton = document.getElementById("register-button") as any;
      registerButton.disabled = true;

      this.$store.dispatch("registerUser", {
        email: this.email,
        password: this.password,
        name: this.name,
        callback: (e: Error, val: boolean, message?: string) => {
          registerButton.disabled = val;
          if (e) {
            return notify({
              title: "Registration failed",
              text: "Unable to register user",
              type: "error",
            });
          }

          if (val) {
            notify({
              title: "User successfully registered",
              text: "Please check you mail to verify your account",
              type: "success",
            });
            return router.push({ name: "Home" });
          } else {
            return notify({
              title: "Registration failed",
              text: message,
              type: "warning",
            });
          }
        },
      });
    },
  },
})
export default class Register extends Vue {}
</script>
