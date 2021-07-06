<template>
  <div id="landing" class="">
    <Header :display-menu="true" />

    <!-- <button @click="subscribeToPushNotifications">Subscribe Here</button> -->
    <main id="main">
      <section id="landing-text">
        <h2 class="major-text darker-color">
          Track your <span class="accent-color">coins</span>
        </h2>
        <p class="lighter-color">
          Tired of asking yourself
          <span class="no-break"
            ><span class="accent-color">"where did my money go"</span> ?</span
          >
          <br />
          Let us help find the hole in your account(s)
          <span class="small-text">this needs to be changed</span>
        </p>
        <router-link
          :to="{ name: isLoggedIn ? 'Dashboard' : 'Register' }"
          class="submit-link-text"
          >TRACK MY COINS</router-link
        >
      </section>
      <section id="landing-image">
        <img src="@/assets/phone.svg" alt="phone screen" />
        <router-link
          :to="{ name: isLoggedIn ? 'Dashboard' : 'Register' }"
          class="submit-link-image"
          >TRACK MY COINS</router-link
        >
      </section>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
main {
  display: flex;
  padding: 4% 10%;
  padding-bottom: 0;
}
main section {
  padding-top: 4%;
}
#landing {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
#landing-text {
  margin-top: 2%;
  width: 45%;
  display: flex;
  flex-direction: column;
  text-align: start;
}
#landing-text p {
  font-family: Poppins;
  font-size: 22px;
}
section a {
  text-decoration: none;
  margin-top: 20px;
  padding: 20px 35px;
  border-radius: 5px;
  font-family: Poppins;
  color: white;
  background-color: #007cff;
  font-size: 20px;
  width: fit-content;
}
.submit-link-image {
  display: none;
}
#landing-image {
  width: 55%;
}

@media screen and (max-width: 600px) {
  .submit-link-image {
    display: block;
    margin: 12% auto 6% auto;
  }
  .submit-link-text {
    display: none;
  }
  main {
    display: flex;
    flex-direction: column;
    padding: 5%;
    padding-top: 0;
    margin: 0;
  }
  main section {
    width: 100% !important;
    display: block;
  }
  main section img {
    width: 85%;
  }
  #landing-text p {
    font-size: 19px;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
// import { subscribeUser } from "@/_helpers/pushNotification";

@Options({
  components: {
    Footer,
    Header,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    subscribeToPushNotifications() {
      // subscribeUser();
    },
  },
})
export default class Landing extends Vue {}
</script>
