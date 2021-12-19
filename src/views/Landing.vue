<template>
  <header class="landing-page">
    <div class="landing-logo"><img src="/img/assets/logo.png" /></div>
    <div class="header-buttons">
      <button class="land-login">Log In</button>
      <button class="land-sign-up">Sign Up, its free!</button>
    </div>
  </header>
  <section id="landing-section">
    <div class="landing-texts">
      <div id="content">
        <div id="content-txt">
          <p><b>Take control of your money</b></p>
          <p>Tired of wondering where all your money went?</p>
          <p>
            Track your spending and expenses across all your bank accounts with
            a single app.
          </p>
          <div id="mobile-illustration">
            <img src="/img/assets/mobile-illustration.png" />
          </div>
          <!-- <div class="texts-buttons">
            <button class="land-login">Log In</button>
            <button class="land-sign-up">Sign Up, its free!</button>
          </div>
          <div class="klove">Made with <b>❤</b> in Nigeria</div> -->
        </div>
        <div class="tablet-illustration">
          <img src="/img/assets/tablet-illustration.png" />
        </div>
      </div>
    </div>
  </section>
  <section id="track-section">
    <div class="track-bold">
      <p>Track Your Coins</p>
    </div>
    <div class="features">
      <div class="feature">
        <!-- <div class="feature-icon">
          <img src="/img/assets/icon1.png" />
        </div> -->
        <div class="feature-content">
          <div class="point" id="main-point">
            <b>One app for all your financial accounts</b>
          </div>
          <div class="point">
            <p>
              Stay on top of your financial records which helps you keep track
              of all your income and expenses, with just a single app.
            </p>
          </div>
        </div>
      </div>
      <div class="feature">
        <!-- <div class="feature-icon">
          <img src="/img/assets/icon2.png" />
        </div> -->
        <div class="feature-content">
          <div class="point" id="main-point">
            <b>One app for all your financial accounts</b>
          </div>
          <div class="point">
            <p>
              Move away from statements and alerts that gives you almost no
              information. Get better and sensible reports on your money.
            </p>
          </div>
        </div>
      </div>
      <div class="feature">
        <!-- <div class="feature-icon">
          <img src="/img/assets/icon3.png" />
        </div> -->
        <div class="feature-content">
          <div class="point" id="main-point">
            <b>One app for all your financial accounts</b>
          </div>
          <div class="point">
            <p>
              We take care of your financial reports so you can focus on
              optimising your money so you can create wealth for yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="track-section">
    <div class="track-bold">
      <p>How It Works</p>
    </div>
    <div class="steps">
      <div class="tablet-illustration" id="step-illus">
        <img src="/img/assets/steps-illustration.png" />
      </div>
      <div class="steps-list">
        <div class="step">
          <div class="numbering">01</div>
          <div class="step-txt">
            <b>Sign up for free</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div class="step">
          <div class="numbering">02</div>
          <div class="step-txt">
            <b>Add a bank account</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div class="step">
          <div class="numbering">03</div>
          <div class="step-txt">
            <b>See your financial report</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="center-div">
      <router-link
        :to="{ name: 'Register' }"
        class="land-sign-up"
        style="padding: 1.5em; height: unset; width: unset; font-size: 0.9em"
      >
        Sign Up, it's free
      </router-link>
    </div>
  </section>
  <section id="track-section">
    <!-- <div class="feature-header">
      <div class="center-div">
        <b>Other Features</b>
      </div>
    </div> -->
    <div class="track-bold">
      <p>Other Features</p>
    </div>
    <div class="other-features">
      <div class="other-feature">
        <div class="other-feature-icon">
          <img src="/img/assets/category.png" />
        </div>
        <div class="step-txt">
          <b>Customize Categories</b>
          <p>
            Make your data even more relvant to you by adding your own
            categories to better make sense of your income and expense.
          </p>
        </div>
      </div>
      <div class="other-feature">
        <div class="other-feature-icon">
          <img src="/img/assets/split.png" />
        </div>
        <div class="step-txt">
          <b>Split Transactions</b>
          <p>
            Got more than one category for a single spend? Split your
            tranactions into different categories for even more accurate data.
          </p>
        </div>
      </div>
      <div class="other-feature">
        <div class="other-feature-icon">
          <img src="/img/assets/record.png" />
        </div>
        <div class="step-txt">
          <b>Record Cash Transactions</b>
          <p>
            Every single coin counts on your journey to taking charge of your
            money! This feature allows you to record how you spend yoru cash
          </p>
        </div>
      </div>
      <div class="other-feature">
        <div class="other-feature-icon">
          <img src="/img/assets/history.png" />
        </div>
        <div class="step-txt">
          <b>Account History</b>
          <p>
            Review how your income and expenses has evolved over time. Get a
            first hand look into what areas you can optimize!
          </p>
        </div>
      </div>
    </div>
  </section>
  <section id="track-section">
    <div class="container-blue">
      <div class="blue">
        <div id="coin-illus">
          <img src="/img/assets/coin.png" />
        </div>
        <div class="coin">
          <b>Rule your money</b>
          <p>
            KoboCounter will help you keep track of your financial habits so
            that you know where your money goes and you are have the right data
            to build your wealth over time
          </p>
        </div>
      </div>
      <div class="center-div" style="margin-bottom: 1em">
        <!-- <router-link :to="{ name: 'Register' }"
          ><button
            class="land-sign-up"
            style="padding: 1.5em; height: unset; width: unset; font-size: 1em"
            @click="() => alert('clicked')"
          >
            Sign Up, it's free
          </button>
        </router-link> -->

        <router-link
          :to="{ name: 'Register' }"
          class="land-sign-up"
          style="padding: 1.5em; height: unset; width: unset; font-size: 1em"
        >
          Sign Up, it's free
        </router-link>
      </div>
    </div>
  </section>
  <section id="footer-section">
    <div class="footer-row">
      <div class="footer-column">
        <div class="f-logo">
          <img src="/img/assets/footer-logo.png" />
        </div>
        <div class="footer-list" id="ivt">
          <div class="trademark">
            Kobocounter is registered under the trademark...
          </div>
          <div class="socials">Follow us on:</div>
          <div class="footer-icons">
            <div class="ft-icon">
              <img src="/img/assets/twitter-icon.png" />
            </div>
            <div class="ft-icon">
              <img src="/img/assets/facebook-icon.png" />
            </div>
            <div class="ft-icon">
              <img src="/img/assets/linkedin-icon.png" />
            </div>
            <div class="ft-icon">
              <img src="/img/assets/instagram-icon.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="footer-column">
        <b>Company</b>
        <p>About Us</p>
        <p>Pricing</p>
        <p>Privacy and Security</p>
        <p>Terms and conditions</p>
      </div>
      <div class="footer-columns">
        <b>Learn More</b>
        <p>Getting Started</p>
        <p>Features</p>
        <p>User Reviews</p>
        <p>Suggest Something</p>
      </div>
      <div class="footer-columns">
        <b>Help</b>
        <p>FAQ's</p>
        <p>Contact Support</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import Footer from "@/components/Footer.vue";
// import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
// import { subscribeUser } from "@/_helpers/pushNotification";

@Options({
  components: {
    // Footer,
    // Header,
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

<style scoped>
* {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  font-family: "Nunito Sans";
}
/* ::-webkit-scrollbar {
  width: 7px;
  margin-right: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
  margin-right: 5px;
}
::-webkit-scrollbar-thumb {
  background: rgba(153, 153, 153, 0.3);
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
} */
img {
  width: 100%;
}
button {
  cursor: pointer;
}
a {
  cursor: pointer;
  text-decoration: none;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  position: fixed;
  width: 100%;
  background-color: #ffffff;
}
#landing-section {
  background-image: url(/img/assets/background\ desktop.png);
  background-position: top -70px right 0px;
  background-repeat: no-repeat;
  box-shadow: 0px 9px 4px rgba(54, 65, 86, 0.1);
  height: 60vh;
}
.landing-logo {
  margin: 0px 2em;
}
.header-buttons {
  margin: 0px 2em;
}
.landing-texts {
  width: 38%;
  /* max-width: 556px; */
  padding-top: 12%;
  padding-left: 5%;
}
.feature-header {
  margin-top: 60px;
}
.landing-texts b,
.feature-header b {
  font-weight: 800;
  font-size: 50px;
  color: #007cff;
}
.landing-texts p {
  font-size: 24px;
  /* font-weight: 600; */
}
.land-login {
  background: #ffffff;
  border: 1px solid #007cff;
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: #007cff;
  width: 162px;
  height: 40px;
}
.land-sign-up {
  background: #007cff;
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  width: 162px;
  height: 40px;
}
.header-buttons,
.texts-buttons {
  width: 352px;
  display: flex;
  justify-content: space-between;
}
.texts-buttons {
  margin-top: 30px;
}
.klove {
  font-size: 24px;
  font-weight: 600;
  color: #007cff;
  margin-top: 150px;
  padding-bottom: 60px;
}
.klove b {
  color: red;
  font-size: 20px;
}
#track-section {
  margin: 40px 0px;
  padding: 0px 30px;
}
.track-bold {
  display: flex;
  justify-content: center;
}
.track-bold p {
  font-style: normal;
  font-weight: 800;
  font-size: 56px;
  border-bottom: 1px solid #d8d8d8;
  padding: 0px 30px;
}
#mobile-illustration {
  display: none;
}
.tablet-illustration {
  display: none;
}
.features {
  display: flex;
  justify-content: space-around;
  margin: 2em 5em 6em;
}
.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feature-icon {
  width: 75px;
}
.feature-content {
  width: 50%;
  background: #007cff;
  border-radius: 30px;
  padding: 30px;
  text-align: center;
  margin-top: 1em;
}
.point {
  color: #ffffff;
  line-height: 28px;
}
#main-point {
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 20px;
  padding-bottom: 20px;
}
.steps {
  display: flex;
  justify-content: center;
}
.step {
  display: flex;
  margin-bottom: 30px;
}
#step-illus,
#coin-illus {
  display: flex;
  width: 40%;
  max-width: 320px;
  min-width: 234px;
  margin: 30px;
  height: fit-content;
}
#step-illus img {
  height: 100%;
}
.steps-list {
  width: 60%;
  min-width: 281px;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.numbering {
  color: #007cff;
  font-size: 32px;
  font-weight: 700;
  margin-right: 20px;
}
.step-txt b {
  font-size: 24px;
}
p {
  font-size: 18px;
}
.center-div {
  display: flex;
  justify-content: center;
  margin-bottom: 5em;
}
.other-features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1080px;
  width: 100%;
  margin: auto;
  margin-bottom: 5em;
}
.other-feature {
  width: 45%;
  max-width: 470px;
  min-width: 380px;
  margin: 2%;
  display: flex;
}
.other-feature-icon {
  width: 150px;
  margin-right: 20px;
}
.container-blue {
  width: 90%;
  background: #f5fbff;
  border-radius: 40px;
  padding: 20px;
  height: fit-content;
  max-width: 1030px;
  margin: auto;
  min-width: fit-content;
}
.blue {
  display: flex;
  margin-bottom: 30px;
}
.coin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 50px;
  max-width: 470px;
}
.coin b {
  font-size: 56px;
  font-weight: 800;
  color: #007cff;
}
#footer-section {
  background-color: #007cff;
  padding: 30px;
}
.footer-column,
.footer-columns {
  width: 210px;
  margin: 30px;
}
.footer-column b,
.footer-columns b,
.socials {
  font-size: 28px;
  color: #ffffff;
  font-weight: bold;
}
.footer-column p,
.footer-columns p {
  color: #ffffff;
  font-size: 18px;
  line-height: 3;
}
.trademark {
  color: #ffffff;
  font-size: 18px;
  margin: 10px 0px;
}
.footer-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
}
.footer-icons {
  display: flex;
  width: 170px;
  justify-content: space-between;
  margin: 10px 0px;
}
.ft-icon {
  width: 30px;
}
.f-logo {
  width: 210px;
}
@media (max-width: 1280px) {
  #mobile-illustration {
    display: none;
  }
  #landing-section {
    background-image: none;
    min-width: unset;
  }
  .tablet-illustration {
    width: 40%;
    max-width: 276px;
    min-width: 180px;
    margin-left: 30px;
    display: block;
  }
  #content {
    display: flex;
    justify-content: space-between;
  }
  .landing-texts {
    width: 100%;
  }
}
@media (max-width: 991px) {
  #landing-section {
    height: unset;
  }
  .landing-logo img {
    width: 220px;
  }
  .landing-texts {
    padding-top: 75px;
  }
  .landing-texts b,
  .feature-header b,
  .coin b {
    font-size: 32px;
  }
  .step-txt b {
    font-size: 18px;
  }
  p {
    font-size: 15px;
  }
  .landing-texts p {
    margin: 10px 0px;
    font-size: 20px;
  }
  .landing-texts p:nth-child(1) {
    margin-top: 10%;
  }
  .content-txt {
    width: 50%;
    margin-top: 100px;
  }
  .land-sign-up,
  .land-login {
    width: 140px;
    font-size: 12px;
    margin: 5px;
  }
  .texts-buttons {
    width: 300px;
  }
  .header-buttons {
    display: none;
  }
  .klove {
    font-size: 18px;
    margin-top: 60px;
  }
  .klove b {
    font-size: 18px;
  }
  .track-bold p {
    font-size: 48px;
  }
  .feature-content {
    border-radius: 20px;
    padding: 25px;
  }
  .feature-content {
    width: 85%;
  }
  .blue {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .coin {
    margin-left: unset;
  }
  #coin-illus img {
    height: 100%;
  }
}
@media (max-width: 960px) {
  .landing-texts {
    /* text-align: center; */
    padding: 4.5em 2em 1em;
  }
  .landing-texts b {
    font-size: 1.3em;
  }
  .landing-texts p {
    font-size: 1.1em;
  }
  .features {
    margin: 1em;
    flex-direction: column;
  }
  .feature-content {
    width: 100%;
    margin-bottom: 2em;
    margin-top: 0;
    padding: 0.8em;
  }
  #main-point {
    margin-bottom: 5px;
    padding-bottom: 8px;
  }
}
@media (max-width: 600px) {
  .tablet-illustration {
    display: none;
  }
  .content-txt {
    width: 100%;
    margin-top: 30px;
  }
  #mobile-illustration {
    display: flex;
    justify-content: center;
    width: 75%;
    margin: 18px auto;
  }
  #mobile-illustration img {
    height: 100%;
  }
  .texts-buttons {
    width: 100%;
    justify-content: space-evenly;
  }
  .land-sign-up,
  .land-login {
    width: 50%;
    height: 50px;
    min-width: 120px;
    font-size: 12px;
  }
  .track-bold p,
  .feature-header b {
    font-size: 28px;
  }
  #step-illus {
    display: none;
  }
  .steps {
    margin-top: 30px;
  }
  .steps-list {
    width: 100%;
    max-width: unset;
    min-width: unset;
  }
  .other-feature {
    width: 100%;
    min-width: unset;
  }
  .footer-columns,
  .footer-column b,
  .footer-columns b,
  .f-logo {
    display: none;
  }
  .footer-row {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }
  #ivt {
    display: flex;
    flex-direction: column-reverse;
  }
  .footer-icons {
    margin: 10px auto;
  }
  .footer-column {
    margin: 30px auto;
    width: 100%;
  }
  #coin-illus {
    width: 50%;
    min-width: 150px;
    margin: 10px;
  }
  #track-section {
    padding: 0px 20px;
  }
  .other-feature-icon {
    width: 100px;
    margin-right: 15px;
  }
}
</style>
