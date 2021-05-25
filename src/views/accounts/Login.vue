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
            <input type="password" name="password" v-model="password" />
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

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import toastr from "toastr";
import { mapGetters } from "vuex";

@Options({
  components: {
    Header,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginUser() {
      (document.getElementById("login_button") as any).disabled = true;
      this.$store.dispatch("loginUser", {
        email: this.email,
        password: this.password,
      });
    },
  },
  computed: {
    ...mapGetters(["loginSuccessful", "loginError"]),
  },
  watch: {
    loginSuccessful(newVal?: boolean) {
      if (newVal == undefined) return;
      if (newVal === true) {
        if (this.$route.params.nextUrl) {
          this.$router.push(this.$route.params.nextUrl);
        } else {
          this.$router.push({ name: "Dashboard" });
        }
      } else {
        (document.getElementById("login_button") as any).disabled = false;
        toastr.info(
          "Email and Password combination is invalid",
          "Login failed"
        );
      }
    },
    loginError(newVal?: boolean) {
      (document.getElementById("login_button") as any).disabled = false;
      if (newVal === true) {
        toastr.error("Unable to login user", "Login failed", {
          preventDuplicates: false,
        });
      }
    },
  },
})
export default class Login extends Vue {}
</script>
