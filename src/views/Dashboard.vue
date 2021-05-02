<template>
  <Header :displayMenu="true" />
  <main></main>
  <aside>
    <img src="@/assets/logo.svg" alt="logo" />
    <p class="accent-color mid-text">You have not added any account</p>
    <p class="lighter-color small-text">
      Add an account to start tracking your leaks
    </p>
    <button type="button" @click="addAccount">ADD AN ACCOUNT</button>
  </aside>
</template>

<style scoped>
main {
  display: none;
}
aside {
  position: absolute;
  margin: 10% 20%;
  width: 60%;
  height: 45%;
  background-color: rgba(240, 248, 255, 0.6);
  display: flex;
  flex-flow: column;
  align-items: center;
}
aside img {
  height: 135px;
  margin-top: 5%;
  margin-bottom: 30px;
}
aside p {
  margin: 0;
}
aside button {
  margin-top: 50px;
}

@media screen and (max-width: 600px) {
  aside {
    margin: 10% 5%;
    width: 90%;
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
  methods: {
    addAccount() {
      const options = {
        onSuccess: function (response: { code: string }) {
          console.log(response.code);
        },
      };
      this.$launchMono(options);
    },
  },
})
export default class Dashboard extends Vue {}
</script>
