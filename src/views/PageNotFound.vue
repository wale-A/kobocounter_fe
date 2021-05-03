<template>
  <main>
    <img
      alt="Not Found"
      src="https://th.bing.com/th/id/R0a373d6d51122ade8642e7acb748ef32?rik=nrVRaXFmAbWxXw&pid=ImgRaw"
    />
    <p class="major-text darker-color">Page Not Found</p>

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
  margin-top: 10%;
}
main img {
  width: 70%;
  margin-bottom: 1%;
}
main button {
  margin-top: 40px;
  width: unset;
}
main button a {
  color: white;
  text-decoration: none;
}

@media screen and (max-width: 800px) {
  main {
    margin-top: 40%;
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
