<template>
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
              'app-menu__item--active': $route.matched
                .map((m) => m.path.toLowerCase())
                .includes(menuItem.route.path.toLowerCase()),
            }"
          >
            <router-link :to="menuItem.route" class="app-menu__link">
              <img :src="menuItem.icon.desktop" class="app-menu__link-icon" />
              <span class="app-menu__link-text">{{ menuItem.title }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <hr class="app-menu__divider" />
      <ul class="app-menu__list">
        <li
          :class="{
            'app-menu__item': true,
            'app-menu__item--active': $route.matched
              .map((m) => m.name)
              .includes('InviteFriends'),
          }"
        >
          <router-link :to="{ name: 'InviteFriends' }" class="app-menu__link">
            <img src="/img/assets/7.png" class="app-menu__link-icon" />
            <span class="app-menu__link-text">Invite Friends</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="l-bottom">
      <nav class="app-menu__list">
        <div class="app-menu__item">
          <a href="#" @click.prevent="$emit('logout')" class="app-menu__link">
            <img src="/img/assets/7.png" class="app-menu__link-icon" />
            <span class="app-menu__link-text">Logout</span>
          </a>
        </div>
      </nav>
      <hr class="app-menu__divider" />
      <footer class="footer">
        <p class="footer__copy">Kobocounter {{ new Date().getFullYear() }}</p>
        <nav class="footer-menu">
          <a href="#" class="footer-menu__link">Terms</a>
          <a href="#" class="footer-menu__link">Privacy</a>
          <a href="#" class="footer-menu__link">Support</a>
        </nav>
      </footer>
    </div>
  </section>
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
.l-container {
  background-color: #007cff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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
    background: #0051a6;
  }

  @at-root #{&}__link-icon {
    margin-right: 5px;
  }

  @at-root #{&}__link {
    font-family: "Nunito Sans";
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
    display: flex;
    align-items: center;
  }

  @at-root #{&}__divider {
    margin: 0 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.35);
  }
}
.footer {
  font-size: 14px;
  line-height: 19px;
  /* identical to box height */

  color: rgba(255, 255, 255, 0.75);

  padding: 15px;
  margin-bottom: 46px;

  @at-root #{&}__copy {
    margin-bottom: 2px;
    text-align: center;
  }
}
.footer-menu {
  margin-top: 15px;

  @at-root #{&}__link {
    font-size: 14px;
    line-height: 19px;
    /* identical to box height */

    color: rgba(255, 255, 255, 0.75);
    // margin-right: 5px;
    padding: 6px;
  }
}
</style>
