<template>
  <Page :username="username" :avatarUrl="avatarUrl">
    <div class="page-body">
      <main>
        <p>
          Thank you for offering to talk to your friends about us.
          <br />
          Please use one or more of the following buttons.
        </p>
        <div>
          <a
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            class="twitter-share-button"
            data-text="Hey ! I&#39;m enjoying using this expense tracker"
            data-url="https://www.kobocounter.com"
            data-related="Kobo_Counter"
            data-via="Kobo_Counter"
            data-size="large"
            data-show-count="false"
            target="_blank"
            >Tweet</a
          >
        </div>

        <div
          class="fb-share-button"
          data-href="https://www.kobocounter.com"
          data-layout="button"
          data-size="large"
        >
          <a
            target="_blank"
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.kobocounter.come%2F&amp;src=sdkpreparse"
            class="fb-xfbml-parse-ignore"
            >Share</a
          >
        </div>
      </main>
    </div>
  </Page>
  <div id="fb-root"></div>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";

@Options({
  components: {
    Page,
  },
  computed: {
    ...mapGetters(["username", "avatarUrl"]),
  },
})
export default class InviteFriends extends Vue {
  username!: string;
  avatarUrl!: string;
}
</script>

<style lang="scss" scoped>
main {
  margin: 5%;
  align-content: center;

  div {
    margin: 2% 0 0;
  }
}
</style>
