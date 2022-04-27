<template>
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
