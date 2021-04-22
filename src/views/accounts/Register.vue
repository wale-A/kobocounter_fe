<template>
  <div id="register">
    <Header />
    <form action="">
      <section v-if="stage == 1">
        <div class="texts">
          <h2 class="major-text accent-text">Holla!</h2>
          <p class="mid-text lighter-text">Tell us your name</p>
          <p class="small-text accent-text">This is what we will call you</p>
        </div>
        <div class="inputs">
          <label for="name" class="small-text lighter-text">
            Your firstname or a nick-name (min. 2 characters, max. 30
            characters)
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
          <h2 class="major-text accent-text">Holla {{ name }}</h2>
          <p class="mid-text lighter-text">Enter your email</p>
          <p class="small-text accent-text">This helps us verify you</p>
        </div>
        <div class="inputs">
          <label for="email" class="small-text lighter-text">
            Your email
          </label>
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
          <h2 class="major-text accent-text">Holla {{ name }}</h2>
          <p class="mid-text lighter-text">Enter your password</p>
          <!-- <p class="small-text accent-text">This helps us verify you</p> -->
        </div>
        <div class="inputs">
          <label for="password" class="small-text lighter-text">
            Your password (min. 8 characters)
          </label>
          <input type="password" name="password" v-model="password" />
          <button type="submit" :disabled="password.length < 8">SUBMIT</button>
        </div>
      </section>
    </form>
  </div>
</template>

<style scoped>
#register {
  display: flex;
  flex-flow: column;
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
    margin: 5% 10%;
  }
  button {
    width: 100%;
    margin-top: 35px;
  }
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Header from "@/components/Header.vue";
import superagent from "superagent";

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
