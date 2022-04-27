<template>
  <aside class="wrapper">
    <section class="l-container">
      <div class="l-top">
        <nav class="app-menu">
          <div class="brand">
            <svg-icon
              :src="require('@/assets/svg/logo-white.svg')"
              class="brand__icon"
            />
          </div>
          <ul class="app-menu__list">
            <li
              v-for="menuItem in menuItems"
              :key="menuItem.route.name"
              class="app-menu__item"
              :class="{
                'app-menu__list--active': $route.matched
                  .map((m) => m.name)
                  .includes(menuItem.route.name),
              }"
            >
              <router-link :to="menuItem.route.name" class="app-menu__link">
                <img :src="menuItem.icon.desktop" class="app-menu__link-icon" />
                <span class="app-menu__link-text">{{ menuItem.title }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <hr class="app-menu__divider" />
        <a href="#" @click.prevent="$emit('logout')">
          <img src="/img/assets/7.png" />
          <span>Invite Friends</span>
        </a>
      </div>
      <div class="l-bottom">
        <a href="#" @click.prevent="$emit('logout')">
          <img src="/img/assets/7.png" />
          <span>Logout</span>
        </a>
        <hr class="app-menu__divider" />
        <footer class="footer">
          <p class="copyright">Kobocounter 2021</p>
          <nav class="footer-menu">
            <a href="#" class="footer-menu__link">Terms</a>
            <a href="#" class="footer-menu__link">Privacy</a>
            <a href="#" class="footer-menu__link">Support</a>
          </nav>
        </footer>
      </div>
    </section>
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

<style lang="scss" scoped>
.wrapper {
  background-color: #007cff;
  height: 100%;
}
.l-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  @at-root #{&}__icon {
    width: 184px;
    height: 32px;
  }
}

.app-menu {
  @at-root #{&}__list {
    list-style: none;
  }

  @at-root #{&}__item {
    padding: 13px 30px;
  }

  @at-root #{&}__item--active {
    padding: 13px 30px;
  }

  @at-root #{&}__link-icon {
    margin-right: 5px;
  }

  @at-root #{&}__link {
    font-family: "Nunito Sans";
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
  }
}
</style>
