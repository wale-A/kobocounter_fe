<template>
  <Header />
  <div id="login">
    <aside id="empty"></aside>
    <main id="content">
      <div class="form-container">
        <h2>Log in</h2>
        <div id="form">
          <div>
            <section class="form-row">
              <label for="email">Email</label>
              <input type="email" name="email" placeholder="abc@xyz.com" />
            </section>
            <section class="form-row">
              <label for="password">Password</label>
              <input type="password" name="password" />
            </section>
            <section>
              <button type="submit">LOGIN</button>
            </section>
          </div>
          <p class="small-text lighter-text">
            Don't have an account ?
            <a href="/account/register" class="accent-text">Register here</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
#login {
  display: flex;
  justify-content: space-between;
  height: 94vh;
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
  margin-top: -20%;
}
h2 {
  font-family: Poppins;
  font-size: 40px;
  font-weight: 600;
}
section {
  margin: 2% 20% 5% 20%;
}

@media screen and (max-width: 600px) {
  section {
    margin: 5% 10% 7% 10%;
  }
  button {
    width: 100%;
    margin-top: 35px;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";

@Options({
  components: {
    Header,
  },
})
export default class Login extends Vue {}
</script>
