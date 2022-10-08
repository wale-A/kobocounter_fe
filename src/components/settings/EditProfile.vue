<template>
  <div class="title"><h3>Edit Profile</h3></div>
  <div class="edit-profile__body">
    <form>
      <Field label="First Name">
        <template #value>
          <input
            type="text"
            required
            name="firstName"
            id="firstName"
            v-model="model.firstName"
            class="edit-profile__text"
          />
        </template>
      </Field>
      <Field label="Last Name">
        <template #value>
          <input
            type="text"
            required
            name="lastName"
            id="lastName"
            v-model="model.lastName"
            class="edit-profile__text"
          />
        </template>
      </Field>

      <div class="edit-profile__actions">
        <input
          type="button"
          value="Save"
          class="button button--primary"
          @click="$emit('editProfile', model)"
        />
        <input
          type="button"
          class="button button--secondary"
          value="Cancel"
          @click="$emit('cancel')"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Field from "../transaction/_internal/Field.vue";
@Options({
  components: { Field },
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.model = {
      firstName: this.profile.split(" ")[0],
      lastName: this.profile.split(" ")[0],
    };
  },
  // data() {
  //   return {
  //     model: {
  //       firstName: (this.profile as UserProfile)?.firstName,
  //       lastName: (this.profile as UserProfile)?.lastName,
  //     },
  //   };
  // },
})
export default class EditProfile extends Vue {
  profile = "";
  model: { firstName?: string; lastName?: string } = {};
}
</script>

<style scoped lang="scss">
.edit-profile {
  @at-root #{&}__body {
    margin-top: 2em;
  }
  @at-root #{&}__actions {
    input {
      // display: block;
      margin: 1.5em;
    }
  }
}
</style>
