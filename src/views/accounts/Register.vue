<template>
  <div class="register container">
    <h1>Register</h1>
    <form>
      <div class="mb-3 row align-items-center">
        <label for="firstNameInput" class="col-3 col-xs-12 form-label"
          >First Name</label
        >
        <input
          id="firstNameInput"
          class="col-9 col-xs-12 form-control"
          placeholder="John"
          v-model="firstName"
        />
      </div>
      <div class="mb-3 row">
        <label for="lastNameInput" class="form-label col-xs-12 col-3"
          >Last Name</label
        >
        <input
          id="lastNameInput"
          class="form-control col-xs-12 col-9"
          placeholder="Doe"
          v-model="lastName"
        />
      </div>
      <div class="mb-3 row">
        <label for="emailInput" class="form-label col-xs-12 col-3">Email</label>
        <input
          type="email"
          class="form-control col-xs-12 col-9"
          id="emailInput"
          v-model="email"
          placeholder="john@doe.com"
        />
      </div>
      <div class="mb-3 row">
        <label for="passwordInput" class="form-label col-xs-12 col-3"
          >Password</label
        >
        <input
          type="password"
          class="form-control col-xs-12 col-9"
          id="passwordInput"
          v-model="password"
        />
      </div>
      <button type="button" class="mt-4 btn btn-primary" @click="registerUser">
        Submit
      </button>
    </form>

    <div class="mt-4">
      Already have an account ? Login
      <router-link to="/account/login">here</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import superagent from "superagent";

@Options({
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    };
  },
  methods: {
    async registerUser() {
      const res = await superagent;
      console.log({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      });
    },
  },
})
export default class Register extends Vue {}
</script>
