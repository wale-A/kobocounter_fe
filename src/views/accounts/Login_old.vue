<template>
  <Header />
  <div id="login">
    <aside id="empty"></aside>
    <main id="content">
      <div class="form-container">
        <h2>Log in</h2>
        <form @submit.prevent="loginUser">
          <section class="form-row">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="abc@xyz.com"
              v-model="email"
            />
          </section>
          <section class="form-row">
            <label for="password">Password</label>
            <Password v-model:password="password" />
          </section>
          <section>
            <button
              type="submit"
              id="login_button"
              :disabled="!(email && password)"
            >
              LOGIN
            </button>
          </section>
        </form>
        <p class="small-text lighter-color">
          Don't have an account ?
          <router-link :to="{ name: 'Register' }" class="accent-color"
            >Register here</router-link
          >
        </p>
      </div>
    </main>
  </div>
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
      const loginButton = document.getElementById("login_button") as any;
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
  text-align: center;
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
