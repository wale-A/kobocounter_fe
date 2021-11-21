<template>
  <nav id="side-bar">
    <section class="side-nav">
      <nav class="uppermenu">
        <div class="logo">
          <img src="/img/assets/logo-white.svg" style="width: 75%" />
        </div>
        <div class="menu">
          <router-link :to="{ name: 'Dashboard' }" class="accent-color">
            <div :class="{ d: true, active: section === 'dashboard' }">
              <img src="/img/assets/1.png" />
              <p>Dashboard</p>
            </div>
          </router-link>
          <router-link :to="{ name: 'Insights' }" class="accent-color">
            <div :class="{ d: true, active: section === 'insights' }">
              <img src="/img/assets/2.png" />
              <p>Insights</p>
            </div>
          </router-link>
          <router-link :to="{ name: 'Transactions' }" class="accent-color">
            <div :class="{ d: true, active: section === 'transactions' }">
              <img src="/img/assets/3.png" />
              <p>Transactions</p>
            </div>
          </router-link>
          <a href="#"
            ><div :class="{ d: true, active: section === 'settings' }">
              <img src="/img/assets/5.png" />
              <p>Settings</p>
            </div></a
          >

          <!-- <a href="#"
            ><div class="d">
              <img src="/img/assets/4.png" />
              <p>Accounts</p>
            </div></a
          >
          <hr />
          <a href="#"
            ><div class="d">
              <img src="/img/assets/6.png" />
              <p>Invite Friends</p>
            </div></a
          > -->
        </div>
      </nav>
      <nav class="lowermenu">
        <a href="#" @click.prevent="logoutUser"
          ><div class="d">
            <img src="/img/assets/7.png" />
            <p>Logout</p>
          </div></a
        >
        <hr />
        <footer>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </footer>
      </nav>
    </section>

    <nav class="bottom-nav">
      <router-link :to="{ name: 'Dashboard' }">
        <div
          :class="{ 'bottom-nav-link': true, active: section === 'dashboard' }"
        >
          <img src="/img/assets/n1.png" />
          <p>Dashboard</p>
        </div>
      </router-link>
      <router-link :to="{ name: 'Insights' }">
        <div
          :class="{ 'bottom-nav-link': true, active: section === 'insights' }"
        >
          <img src="/img/assets/n2.png" />
          <p>Insights</p>
        </div>
      </router-link>
      <router-link :to="{ name: 'Transactions' }">
        <div
          :class="{
            'bottom-nav-link': true,
            active: section === 'transactions',
          }"
        >
          <img src="/img/assets/n3.png" />
          <p>Transactions</p>
        </div>
      </router-link>
      <div :class="{ 'bottom-nav-link': true, active: section === 'settings' }">
        <img src="/img/assets/n5.png" />
        <p>Settings</p>
      </div>

      <!-- <div class="bottom-nav-link">
        <img src="/img/assets/n4.png" />
        <p>Accounts</p>
      </div>-->
    </nav>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    section: String,
  },
})
export default class SideBar extends Vue {}
</script>
