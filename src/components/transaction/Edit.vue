<template>
  <div class="transaction">
    <div class="transaction__header">
      <button class="transaction__nav" @click="$router.go(-1)">
        <svg-icon
          :src="require('@/assets/svg/back.svg')"
          class="transaction__nav-icon"
        />
      </button>
      <div class="transaction__title">Edit Transaction Detail</div>
    </div>
    <div class="transaction__body">
      <form>
        <Field label="Transaction Type:">
          <template #value>
            <Multiselect
              :searchable="true"
              placeholder="Transaction category"
              v-model="model.displayCategory"
              :options="transactionCategories"
              noResultsText="No result found"
            />
          </template>
        </Field>
        <Field label="Expense Category:"
          ><template #value>
            <Multiselect
              :searchable="true"
              placeholder="Transaction category"
              v-model="model.expenseCategory"
              :options="expenseCategories"
              noResultsText="No result found"
            />
          </template>
        </Field>

        <div class="transaction__field-group">
          <label for="business-establishment" class="transaction__field">
            <input
              id="business-establishment"
              name="business-establishment"
              type="checkbox"
              :checked="transaction?.establishment?.name"
              v-model="model.isEstablishment"
              :disabled="!model?.recipientName[0]"
              class="transaction__field-checkbox"
            />
            <span>Was this money paid to a busineess ?</span>
          </label>
        </div>

        <Field label="Recipient:">
          <template #value>
            <Multiselect
              :searchable="true"
              placeholder="Recipient"
              v-model="model.recipientName"
              :options="allEstablishments"
              :createTag="true"
              mode="tags"
              :max="Number('1')"
              @tag="$emit('addEstablishment', $event)"
              @change="changedEstablishment"
            />
          </template>
        </Field>

        <div class="transaction__actions">
          <input
            type="button"
            value="SAVE"
            class="button button--primary"
            @click.stop="$emit('saveEdit', model)"
          />
          <input
            type="button"
            class="button button--secondary"
            value="CANCEL"
            @click.stop="$emit('cancel')"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import Header from "./_internal/Header.vue";
import Field from "./_internal/Field.vue";
import { TRANSACTION_CATEGORIES, EXPENSE_CATEGORIES } from "@/config";
import { formatDate, formatTime } from "@/util";
@Options({
  components: { Field, Header, Multiselect },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
    establishments: Object,
    parent: Object,
    sub: Array,
  },
  data() {
    return {
      model: null,
    };
  },
  computed: {
    allEstablishments() {
      return Object.keys(this.establishments);
    },
    allActivities() {
      return [
        ...new Set(
          Object.values(this.establishments as Record<string, string[]>)
            .flat()
            .map((x) => x.split(","))
            .flat()
        ),
      ];
    },
    transactionCategories() {
      return TRANSACTION_CATEGORIES;
    },
    expenseCategories() {
      return EXPENSE_CATEGORIES;
    },
    date() {
      return formatDate(this.transaction?.date);
    },
    time() {
      return formatTime(this.transaction?.date);
    },
  },
  methods: {
    changedEstablishment(val: string[]) {
      let activities = [];
      if (val && val.length > 0) {
        activities = this.establishments[val[0]] || [];
      }
      this.model.establishmentActivities = activities;
      this.model.isEstablishment = activities.length > 0;
    },
  },
  created() {
    this.model = {
      id: this.transaction.id,
      displayCategory: this.transaction.displayCategory,
      recipientName: this.transaction?.establishment?.name
        ? [this.transaction?.establishment?.name]
        : this.transaction?.recipient
        ? [this.transaction?.recipient]
        : [],
      isEstablishment: !!this.transaction?.establishment?.name,
      establishmentActivities:
        this.transaction?.establishment?.activities || [],
    };
  },
})
export default class Edit extends Vue {}
</script>

<style lang="scss" scoped>
.transaction {
  @at-root #{&}__header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin: 0 12px 0 0;
  }
  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
  }
  @at-root #{&}__body {
    margin-top: 2em;
  }
  @at-root #{&}__field {
    display: flex;
    align-items: center;
  }
  @at-root #{&}__field-checkbox {
    width: 17px;
    height: 17px;
    margin-right: 7px;
  }

  @at-root #{&}__actions {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
  }
}

.multiselect {
  margin: 0;
}
</style>

<style lang="scss">
.button {
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  border: 1px solid #007cff;
  background: white;
  border-radius: 5px;
  color: #007cff;
  width: 100%;
  padding: 1em;
  width: unset;
  height: unset;

  @at-root #{&}--primary {
    background: #007cff;
    color: white;
    margin-bottom: 14px;
  }
}
</style>
