<template>
  <div class="btn-wrapper">
    <button type="button" @click="launchMono">Launch Mono</button>
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {
      amount: 200,
    };
  },
  methods: {
    launchMono() {
      const options = {
        onSuccess: function (response) {
          const code = response.code;
        },
        onClose: function () {
          alert("user closed the widget.");
        },
      };
      this.$launchMono(options);
    },
  },
})
export default class AddAccout extends Vue {}
</script>
