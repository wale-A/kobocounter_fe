<template>
  <div class="login container">
    <h1>Register</h1>
    <form>
      <div class="mb-3">
        <label for="emailInput" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="emailInput"
          placeholder="john@doe.com"
        />
      </div>
      <div class="mb-3">
        <label for="passwordInput" class="form-label">Password</label>
        <input type="password" class="form-control" id="passwordInput" />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Login extends Vue {}
</script>
