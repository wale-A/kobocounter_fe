<template>
  <div class="title"><h3>Change Password</h3></div>
  <div class="edit-profile__body">
    <form>
      <Field label="Current Password">
        <template #value>
          <Password v-model:password="currentPassword" />
        </template>
      </Field>
      <Field label="New Password">
        <template #value>
          <Password v-model:password="newPassword" />
        </template>
      </Field>

      <div class="edit-profile__actions">
        <input
          type="button"
          value="Save"
          class="button button--primary"
          @click="$emit('updatePassword', { currentPassword, newPassword })"
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
import Password from "../Password.vue";
import Field from "../transaction/_internal/Field.vue";
@Options({
  components: { Field, Password },
})
export default class ChangePassword extends Vue {
  currentPassword = "";
  newPassword = "";
}
</script>

<style scoped lang="scss">
.edit-profile {
  @at-root #{&}__actions {
    input {
      margin: 2em 1em 0;
    }
  }
}
form {
  margin: 2em 0;
}

@media (min-width: 1200px) {
  .edit-profile {
    @at-root #{&}__actions {
      input {
        margin: 1.5em;
      }
    }
  }
}
</style>
