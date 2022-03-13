<template>
  <div id="app">
    <!--TODO: Add loader here -->
    <Layout>
      <router-view />
    </Layout>

    <notifications :ignoreDuplicates="true" :duration="5000" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Layout from "@/layouts/Layout.vue";
@Options({
  name: "App",
  components: { Layout },
})
export default class App extends Vue {}
</script>
