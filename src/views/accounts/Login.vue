<template>
  <div id="register">
    <aside id="empty"></aside>
    <main id="content">
      <div class="form-container">
        <h2>Log in</h2>
        <div id="form">
          <div>
            <section class="form-row">
              <p class="label">Email</p>
              <input type="email" name="email" placeholder="abc@xyz.com" />
            </section>
            <section class="form-row">
              <p class="label">Password</p>
              <input type="password" name="password" />
            </section>
            <button type="submit">LOGIN</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
#register {
  display: flex;
  justify-content: space-between;
  height: 100vh;
}
aside {
  flex: 1 1 0;
}
main {
  flex: 1 0 350px;
  background-color: #f2f6fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.form-container {
  margin-top: -10%;
}
h2 {
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
}
section {
  margin: 2% 20% 5% 20%;
}
section .label {
  text-align: start;
  font-size: 16px;
  line-height: 24px;
  font-family: Poppins;
  font-weight: 500;
  margin-bottom: 0;
}
input {
  height: 48px;
  width: 100%;
  background: #ffffff;
  border: 2px solid #bfdeff;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 10px;
}

@media screen and (max-width: 600px) {
  section {
    margin: 5% 10% 7% 10%;
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Login extends Vue {}
</script>
