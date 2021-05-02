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
                @click="loginUser"
                :disabled="!(email && password)"
              >
                LOGIN
              </button>
            </section>
          </div>
          <p class="small-text lighter-color">
            Don't have an account ?
            <a href="/account/register" class="accent-color">Register here</a>
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
import superagent from "superagent";
import toastr from "toastr";
import { User } from "@/types";

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
      try {
        const res = await superagent
          .post(`${process.env.VUE_APP_API_URL}/users/login`)
          .send({ email: this.email, password: this.password })
          .ok((res) => res.status < 500);

        if (res.status !== 200) {
          toastr.info(res.text, "Login failed");
        } else {
          // refreshing the page clears the store.. this is still a WIP
          window.localStorage.setItem(
            "authenticated-user",
            JSON.stringify(res.body)
          );
          this.$store.commit("setUser", res.body as User);
          this.$router.push({ name: "Home" });
        }
      } catch (e) {
        toastr.error("Unable to login user", "Login failed");
        console.log(e);
      }
    },
  },
})
export default class Login extends Vue {}
</script>
