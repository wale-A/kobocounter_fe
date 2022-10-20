<template>
  <div id="header-section">
    <header>
      <img src="/img/assets/logo.png" alt="logo" class="logo" />
      <div class="buttons">
        <router-link v-if="!isLoggedIn" :to="{ name: 'Login' }">
          Log in
        </router-link>
        <router-link
          v-if="!isLoggedIn"
          :to="{ name: 'Register' }"
          class="alternate"
        >
          Sign Up
        </router-link>
        <router-link v-if="isLoggedIn" :to="{ name: 'Dashboard' }">
          Go to Dashboard
        </router-link>
      </div>
    </header>

    <section id="section-1">
      <main>
        <h2>
          Track your expenses.
          <br />
          Rule your money.
        </h2>
        <p>
          Tired of wondering where all your money went?
          <br />
          Track your spending and expenses across all your bank accounts
          <br />
          with a single app.
        </p>
        <div class="buttons">
          <router-link
            v-if="!isLoggedIn"
            :to="{ name: 'Login' }"
            style="text-align: center; line-height: 40px"
          >
            Log in
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            :to="{ name: 'Register' }"
            style="text-align: center; line-height: 40px"
            class="alternate"
          >
            Create an account
          </router-link>
          <router-link
            v-if="isLoggedIn"
            :to="{ name: 'Dashboard' }"
            style="text-align: center; line-height: 40px"
            class="alternate"
          >
            Go to Dashboard
          </router-link>
        </div>
      </main>
      <aside>
        <img
          src="/img/landing/transactions-source-1x.png"
          alt="sources of transactions"
          srcset="
            /img/landing/transactions-source-dot5x.png   900w,
            /img/landing/transactions-source-dot75x.png 1200w,
            /img/landing/transactions-source-1x.png     2500w
          "
        />
      </aside>
    </section>
  </div>

  <section id="section-2">
    <main>
      <h2>Start tracking your coins today</h2>
      <div>
        <p>
          <b>One app for all your financial accounts</b>
          <br />
          Stay on top of your financial records and keep
          <br />
          track of all your income and expenses, with just
          <br />
          a single app.
        </p>
        <p>
          <b>Money alerts that make sense</b>
          <br />
          Move away from statements and alerts that give you
          <br />
          very little information. Get better and sensible
          <br />
          reports on your money.
        </p>
        <p>
          <b>Get rid of anxiety about your money</b>
          <br />
          We take care of your financial reports so you can
          <br />
          focus on optimising your money and creating wealth
          <br />
          for yourself.
        </p>
      </div>
    </main>
    <aside>
      <img
        src="/img/landing/start-tracking-dot75x.png"
        alt="start tracking transactions"
        srcset="
          /img/landing/start-tracking-dot5x.png   900w,
          /img/landing/start-tracking-dot75x.png 1200w,
          /img/landing/start-tracking-1x.png     2500w
        "
      />
    </aside>
  </section>
  <section id="section-3">
    <h2>How it works</h2>
    <div class="list" style="justify-content: space-between">
      <div>
        <h3>01</h3>
        <p>
          <b>Sign up for free</b>
        </p>
      </div>
      <div>
        <h3>02</h3>
        <p>
          <b>Add a bank account</b>
        </p>
      </div>
      <div>
        <h3>03</h3>
        <p>
          <b>See your financial report</b>
        </p>
      </div>
    </div>
  </section>
  <section id="section-4">
    <aside>
      <img
        src="/img/landing/other-features-dot75x.png"
        alt="other featues"
        srcset="
          /img/landing/other-features-dot5x.png   900w,
          /img/landing/other-features-dot75x.png 1200w,
          /img/landing/other-features-1x.png     2500w
        "
      />
    </aside>
    <main>
      <h2 class="center-text">Other Features</h2>
      <div class="list" style="justify-content: space-between">
        <div>
          <img
            src="/img/landing/customize-categories.png"
            alt="cutomize categories"
          />
          <p>
            <b>Customize Categories</b>
            <br />
            Make your data even more relevant to
            <br />
            you by adding your own categories to
            <br />
            better make sense of your income and
            <br />
            expense.
          </p>
        </div>
        <div>
          <img
            src="/img/landing/split-transactions.png"
            alt="split transactions"
          />
          <p>
            <b>Split transactions</b>
            <br />
            Got more than one category for a
            <br />
            single bank transaction? Split your
            <br />
            transactions into different categories for
            <br />
            even more accurate data.
          </p>
        </div>
        <div class="break"></div>
        <div>
          <img
            src="/img/landing/record-cash-transactions.png"
            alt="record cash transactions"
          />
          <p>
            <b>Record Cash Transactions</b>
            <br />
            Every single coin counts on your
            <br />
            journey to taking charge of your
            <br />
            money! This feature allows your to
            <br />
            record how you spend your cash.
          </p>
        </div>
        <div>
          <img src="/img/landing/account-history.png" alt="account history" />
          <p>
            <b>Account History</b>
            <br />
            Review how your income and
            <br />
            expenses have evolved over time. Get a
            <br />
            first hand look into what areas you can
            <br />
            optimize.
          </p>
        </div>
      </div>
      <div class="buttons">
        <router-link
          v-if="!isLoggedIn"
          :to="{ name: 'Login' }"
          class="land-login"
          style="text-align: center; line-height: 40px"
        >
          Log in
        </router-link>
        <router-link
          v-if="!isLoggedIn"
          :to="{ name: 'Register' }"
          style="text-align: center; line-height: 40px"
          class="alternate"
        >
          Create an account
        </router-link>
        <router-link
          v-if="isLoggedIn"
          :to="{ name: 'Dashboard' }"
          style="text-align: center; line-height: 40px"
        >
          Go to Dashboard
        </router-link>
      </div>
    </main>
  </section>
  <footer></footer>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";

@Options({
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
})
export default class NewLanding extends Vue {}
</script>

<style scoped>
h2 {
  color: black;
}
header {
  margin-bottom: 1em;
}
section,
footer {
  padding: 2.5em;
}
p {
  font-size: 1.1em;
  margin-bottom: 1.2em;
}
h3 {
  font-size: 2em;
  margin-bottom: 0.8em;
  color: #007cff;
  font-weight: 900;
}
a {
  border: 1px solid rgb(0, 124, 255);
  border-radius: 10px;
  /* font-weight: 600; */
  margin-top: 1.5em;
  padding: 0.4em 1.5em;
  font-size: 1em;
}
a.alternate {
  background-color: rgb(0, 124, 255);
  color: white;
}
#header-section {
  background: rgb(0, 124, 255);
  /* background-color: #fffdf7; */
  background: linear-gradient(
    90deg,
    rgba(0, 124, 255, 0.15) 20%,
    rgba(253, 191, 19, 0.25) 48%,
    rgba(253, 191, 19, 0.1) 76%
  );
}
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 6vh;
  padding: 0 3em 0 1em;
}
header .buttons {
  width: 15%;
}
header a {
  font-weight: unset;
  margin-top: 1em;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 600;
}
#section-1,
#section-2,
#section-3,
#section-4,
div.list,
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
#section-2 {
  /* background-color: #f1f4f7; */
  padding: 5em 0;
}
div.list {
  width: 90%;
  flex-flow: row wrap;
}
#section-3 {
  background: rgb(253, 191, 19);
  background: linear-gradient(
    90deg,
    rgba(253, 191, 19, 0.5) 35%,
    rgba(0, 124, 255, 0.5) 63%
  );
  /* background-color: #f6f9fb; */
  flex-direction: column;
  padding: 5em;
}
#section-4 {
  padding: 5em;
  background-color: #e5e5e5;
}
#section-4 main {
  display: flex;
  flex-direction: column;
  /* align-content: center; */
  /* align-items: center; */
}
#section-4 main {
  margin-left: 10%;
}
#section-4 .buttons {
  width: 50%;
}
.break {
  flex-basis: 100%;
  height: 0;
}
p b {
  font-size: 1.2em;
}

@media (min-width: 2000px) {
  aside {
    display: flex;
    justify-content: center;
  }
  aside img {
    width: 50%;
  }
}

@media (max-width: 860px) {
  header {
    height: 6vh;
    padding-top: 1em;
  }
  header img {
    height: 3.2em;
  }
  header a {
    display: none;
  }
  #section-1,
  #section-2,
  #section-3,
  #section-4,
  div.list {
    flex-direction: column;
    padding-left: 2em;
    padding-right: 2em;
  }
  div.list {
    width: 100%;
  }
  h2 {
    margin-top: 1.2em;
  }
  .center-text {
    text-align: center;
  }
  a {
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 1em;
    padding: 0.6em 1em;
    font-size: 1em;
  }
  #section-1 aside {
    margin-bottom: unset;
    margin-right: unset;
  }
  #section-3 {
    padding: 2em;
  }
  .list {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
  .buttons {
    width: 100% !important;
  }
  p b {
    display: block;
    margin-bottom: 0.3em;
  }
  br {
    display: none;
  }
  aside {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  aside img {
    width: 65%;
  }
  #section-4 main div.list {
    margin-left: 0;
  }
  #section-4 main h2 {
    margin-bottom: 1em;
    margin-top: 2em;
  }
  #section-4 aside img {
    width: 50%;
  }
  #section-2 aside img {
    margin-top: 2em;
  }
}

@media (max-width: 750px) {
  aside {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  aside img {
    width: 100%;
  }
  #section-4 aside img {
    width: 80%;
  }
  #section-4 main {
    margin-left: 0;
  }
}
</style>
