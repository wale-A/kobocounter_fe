<template>
  <div id="landing" class="">
    <Header :displayMenu="true" />
    <!-- main section -->
    <main id="main">
      <section id="landing-text">
        <h2 class="major-text darker-text">
          Track your <span class="accent-text">coins</span>
        </h2>
        <p class="lighter-text">
          Tired of asking
          <span class="accent-text">"where did my money go"</span> ? <br />
          Let us help you find out where your account is leaking
        </p>
        <a href="/account/register" class="submit-link-text">TRACK MY COINS</a>
      </section>
      <section id="landing-image">
        <img src="@/assets/phone.svg" alt="phone screen" />
        <a href="/account/register" class="submit-link-image">TRACK MY COINS</a>
      </section>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
main {
  display: flex;
  padding: 5% 12%;
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
  width: 35%;
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
  padding: 15px 25px;
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
  width: 65%;
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

@Options({
  components: {
    Footer,
    Header,
  },
})
export default class Landing extends Vue {}
</script>
