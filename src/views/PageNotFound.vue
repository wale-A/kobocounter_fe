<template>
  <main>
    <img
      alt="Not Found"
      src="https://th.bing.com/th/id/R0a373d6d51122ade8642e7acb748ef32?rik=nrVRaXFmAbWxXw&pid=ImgRaw"
    />

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
  margin-top: 25%;
}
main img {
  width: 90%;
  margin-bottom: 15%;
}
main button {
  width: unset;
}
main button a {
  color: white;
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class PageNotFound extends Vue {}
</script>
