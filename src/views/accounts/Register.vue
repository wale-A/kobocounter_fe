<template>
  <div class="wb">
    <div>
      <h1 id="wb">Sign up</h1>
    </div>
    <div class="formBx">
      <form @submit.prevent="registerUser">
        <p>Hola! What's your name?</p>
        <input type="text" required name="Name" v-model="name" />
        <p>Enter your email address</p>
        <input type="email" required name="Email" v-model="email" />
        <p>Choose a Password (min. of 8 characters)</p>
        <!--Password v-model:password="password" /-->
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
            :disabled="disabled || !valid"
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
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Options } from "vue-class-component";
import Header from "@/components/layout/Header.vue";
import Password from "@/components/Password.vue";
import { mapActions } from "vuex";

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
      disabled: false,
    };
  },
  computed: {
    valid() {
      return (
        this.name && this.email && this.password && this.acceptPreCondition
      );
    },
  },
  methods: {
    ...mapActions(["register"]),
    async registerUser() {
      this.disabled = true;

      this.register({
        email: this.email,
        password: this.password,
        name: this.name,
      })
        .then(() => {
          this.$notify({
            title: "User successfully registered",
            text: "Please check you mail to verify your account",
            type: "success",
          });
          this.$router.push({ name: "Home" });
        })
        .catch(() => {
          this.disabled = false;
          this.$notify({
            title: "Registration failed",
            text: "Unable to register user",
            type: "error",
          });
        });
    },
  },
})
export default class Register extends Vue {}
</script>
