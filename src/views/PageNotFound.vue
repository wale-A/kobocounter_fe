<template>
  <main>
    <img alt="Not Found" src="/img/404.png" />
    How did you get here ?
    <br /><br />
    this should not have happened .....

    <button>
      <router-link :to="{ name: 'Home' }"> GO HOME </router-link>
    </button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3em;
}
main img {
  width: 40%;
  margin-top: 5%;
  margin-bottom: 3%;
}
main button {
  margin-top: 60px;
  width: 130px;
  height: 60px;
}
main button a {
  color: black;
  text-decoration: none;
  font-size: 1.4em;
}

@media screen and (max-width: 800px) {
  main {
    margin-top: 40%;
    font-size: 1.1em;
  }
  main img {
    width: 85%;
    margin-bottom: 10%;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class PageNotFound extends Vue {}
</script>
