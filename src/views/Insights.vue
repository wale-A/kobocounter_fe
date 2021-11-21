<template>
  <main class="dashboard">
    <SideBar :section="'insights'" />
    <section class="dashboard-content-container">
      <Header />
    </section>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";

@Options({
  components: {
    SideBar,
    Header,
  },
})
export default class Insights extends Vue {}
</script>
