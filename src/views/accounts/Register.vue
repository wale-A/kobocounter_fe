<template>
  <div id="register">
    <Header />
    <form>
      <section v-if="stage == 1">
        <div class="texts">
          <h2 class="major-text accent-color">Holla!</h2>
          <p class="mid-text lighter-color">Tell us your name</p>
          <p class="small-text accent-color">This is what we will call you</p>
        </div>
        <div class="inputs">
          <label for="name" class="lighter-color">
            <span class="mid-text">Your firstname or a nick-name</span>
            <span class="small-text no-break">
              (min. 2 characters, max. 30 characters)
            </span>
          </label>
          <input
            type="text"
            name="name"
            v-model="name"
            placeholder="james-bond"
          />
          <button
            @click="stage++"
            :disabled="name.length < 2 || name.length > 30"
          >
            NEXT
          </button>
        </div>
      </section>

      <section v-if="stage == 2">
        <div class="texts">
          <h2 class="major-text accent-color">Holla {{ shortName }}</h2>
          <p class="mid-text lighter-color">Enter your email</p>
          <p class="small-text accent-color">This helps us verify you</p>
        </div>
        <div class="inputs">
          <label for="email" class="mid-text lighter-color"> Your email </label>
          <input
            type="email"
            name="email"
            v-model="email"
            placeholder="007@MI6.com"
          />
          <button @click="stage++" :disabled="email.length < 5">NEXT</button>
        </div>
      </section>

      <section v-if="stage == 3">
        <div class="texts">
          <h2 class="major-text accent-color">Holla {{ shortName }}</h2>
          <p class="mid-text lighter-color">Enter your password</p>
          <!-- <p class="small-text accent-color">This helps us verify you</p> -->
        </div>
        <div class="inputs">
          <label for="password" class="small-text lighter-color">
            <span class="mid-text">Your password</span>
            <span class="small-text no-break"> (min. 8 characters) </span>
            <br />
          </label>
          <input type="password" name="password" v-model="password" />
          <button
            id="register-button"
            @click.prevent="registerUser"
            type="submit"
            :disabled="password.length < 8"
          >
            SUBMIT
          </button>
        </div>
      </section>

      <p class="small-text lighter-color">
        Already have an account ?
        <a href="/account/login" class="accent-color">Login here</a>
      </p>
    </form>
  </div>
</template>

<style scoped>
#register {
  display: flex;
  flex-flow: column;
}
form {
  text-align: center;
}
section {
  display: flex;
  flex-direction: column;
}
.texts h2 {
  margin-bottom: 0;
}
.texts p {
  margin: 0;
}
.inputs {
  margin: 5% 20%;
}
button {
  margin: 25px auto;
}

@media screen and (max-width: 600px) {
  .inputs {
    margin: 10% 10%;
  }
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Options } from "vue-class-component";
import Header from "@/components/Header.vue";
import superagent from "superagent";
import toastr from "toastr";

@Options({
  components: {
    Header,
  },
  data() {
    return {
      stage: 1,
      email: "",
      name: "",
      password: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        (document.getElementById("register-button") as any).disabled = true;
        const res = await superagent
          .post(`${process.env.VUE_APP_BE_URL}/users`)
          .send({ email: this.email, password: this.password, name: this.name })
          .ok((res) => res.status < 500);

        console.log({ res });

        if (res.status !== 201) {
          toastr.error(res.text, "Registration failed");
        } else {
          toastr.success(
            "User successfully registered, please check you mail for verification",
            "Success"
          );
          this.$router.push({ name: "Home" });
        }
      } catch (e) {
        toastr.error("Unable to register user", "Registration failed");
        (document.getElementById("register-button") as any).disabled = false;
        console.log(e);
      }
    },
  },
  computed: {
    shortName() {
      return this.name.length > 7 ? `${this.name.slice(0, 2)}..` : this.name;
    },
  },
})
export default class Register extends Vue {}
</script>
