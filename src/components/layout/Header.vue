<template>
  <header id="menu" class="header">
    <div class="salutation">
      <h1 class="salutation__title">Hi {{ username }}!</h1>
      <p class="salutation__message">Welcome back!</p>
    </div>
    <div class="actions">
      <slot />
      <div class="user-menu">
        <button class="user-menu__trigger" @click="toggleMenu">
          <img :src="avatarUrl" alt="avatar" class="user-menu__icon" />
        </button>
        <div v-show="openMenu" class="user-menu__dropdown">
          <a href="#" class="user-menu__link" @click.prevent="$emit('logout')">
            Logout
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Filter from "@/components/common/Filter.vue";

@Options({
  components: {
    Filter,
  },
  props: {
    displayMenu: Boolean,
    avatarUrl: String,
    username: String,
  },
  data() {
    return {
      openMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.openMenu = !this.openMenu;
    },
  },
})
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.header {
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(28, 82, 152, 0.15);
  border-radius: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 87px;
  margin-bottom: 13px;
  padding: 0 23px;
  @include for-size(tablet-landscape-up) {
    border-radius: 5px;
    box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
  }
}

.salutation {
  @at-root #{&}__title {
    font-family: Nunito Sans;
    font-size: 24px;
    font-weight: 800;
    line-height: 33px;
  }

  @at-root #{&}__message {
    font-family: Nunito Sans;
    font-size: 16px;
    line-height: 22px;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
}

.user-menu {
  display: inline-block;
  position: relative;

  @at-root #{&}__trigger {
    background: transparent;
    border: none;
  }

  @at-root #{&}__icon {
    width: 40px;
  }

  @at-root #{&}__dropdown {
    background-color: green;
    margin-left: -25px;
    position: absolute;
    z-index: 1;
  }

  @at-root #{&}__link {
    /* background-color: #fafafa; */
    color: #1c5298;
    padding: 10px 20px;
    text-decoration: none;
    display: block;
    font-family: Poppins;
    cursor: pointer;

    :hover {
      background-color: #f1f1f1;
      color: #007cff;
    }
  }
}

@media screen and (max-width: 900px) {
  .dropdown-content {
    margin-left: -3em;
  }
  .header-avatar {
    width: 32px;
  }
}
</style>
