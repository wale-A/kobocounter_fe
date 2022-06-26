<template>
  <nav class="nav-bar">
    <router-link
      v-for="menuItem in menuItems"
      :key="menuItem.route.name"
      :to="menuItem.route.name"
      class="nav-bar__link"
    >
      <div
        :class="{
          'nav-bar__item': menuItem.medium.mobile,
          'nav-bar__item--active': $route.matched
            .map((m) => m.name)
            .includes(menuItem.route.name),
        }"
      >
        <img :src="menuItem.icon.mobile" class="nav-bar__icon" />
        <p class="nav-bar__text">{{ menuItem.title }}</p>
      </div>
    </router-link>
  </nav>
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
export default class NavBar extends Vue {}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0px -2px 4px rgb(54 65 86 / 10%);
  border-radius: 10px 10px 0px 0px;
  align-items: center;
  width: 100%;
  padding: 14px 25px;
  height: 72px;

  @at-root #{&}__link {
    text-decoration: none;
  }

  @at-root #{&}__item {
    font-size: 0.8em;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
    color: black;
  }

  @at-root #{&}__item--active {
    color: #007cff;
    font-weight: 800;
    font-size: 0.9em;
  }
}
</style>
