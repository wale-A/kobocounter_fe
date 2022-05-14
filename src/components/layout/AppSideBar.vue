<template>
  <aside id="side-bar">
    <section class="side-nav">
      <nav class="uppermenu">
        <div class="logo">
          <img src="/img/assets/logo-white.svg" style="width: 75%" />
        </div>
        <div class="menu">
          <router-link
            v-for="menuItem in menuItems"
            :key="menuItem.route.name"
            :to="menuItem.route.name"
            class="accent-color"
          >
            <div
              :class="{
                d: menuItem.medium.desktop,
                active: $route.matched
                  .map((m) => m.name)
                  .includes(menuItem.route.name),
              }"
            >
              <img :src="menuItem.icon.desktop" />
              <p>{{ menuItem.title }}</p>
            </div>
          </router-link>
        </div>
      </nav>
      <nav class="lowermenu">
        <a href="#" @click.prevent="$emit('logout')"
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
      <router-link
        v-for="menuItem in menuItems"
        :key="menuItem.route.name"
        :to="menuItem.route.name"
        class="accent-color"
      >
        <div
          :class="{
            'bottom-nav-link': menuItem.medium.mobile,
            active: $route.matched
              .map((m) => m.name)
              .includes(menuItem.route.name),
          }"
        >
          <img :src="menuItem.icon.mobile" />
          <p>{{ menuItem.title }}</p>
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
  },
})
export default class SideBar extends Vue {}
</script>
