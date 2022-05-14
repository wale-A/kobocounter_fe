<template>
  <div>
    <Header
      :alt="`${transaction?.bank} logo`"
      :src="`/img/banks/${transaction?.bank}.svg`"
      :date="date"
      :time="time"
      class="transaction__header"
    />
    <div class="transaction__body">
      <form>
        <Field label="transaction category:" orientation="column">
          <template #value>
            <Multiselect
              :searchable="true"
              placeholder="Transaction category"
              v-model="model.displayCategory"
              :options="categories"
              noResultsText="No result found"
            />
          </template>
        </Field>
        <!-- TODO: format currency ---->
        <Field label="amount:">
          <template #value>
            <label>
              <span style="font-weight: 800; font-size: large">&#8358; </span>
              <span
                :style="{
                  'font-weight': 500,
                  color:
                    (transaction?.amount || transaction?.displayAmount) < 0
                      ? 'rgba(255, 10, 10, 0.7)'
                      : 'rgb(20, 180, 20)',
                }"
              >
                {{
                  Math.abs(
                    transaction?.amount || transaction?.displayAmount
                  ).toLocaleString()
                }}
              </span>
            </label>
          </template>
        </Field>
        <Field label="recipient:" orientation="column">
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

        <div style="margin-top: 1em">
          <label for="business-establishment">
            <input
              id="business-establishment"
              name="business-establishment"
              type="checkbox"
              :checked="transaction?.establishment?.name"
              v-model="model.isEstablishment"
              :disabled="!model?.recipientName[0]"
              style="width: unset !important; vertical-align: bottom"
            />
            Recipient is a business establishment
          </label>
        </div>

        <Field label="business activity:" orientation="column">
          <template #value>
            <Multiselect
              :searchable="true"
              v-if="model.recipientName.length === 1 && model.isEstablishment"
              placeholder="Establishment's activites"
              v-model="model.establishmentActivities"
              :options="allActivities"
              mode="tags"
              :createTag="true"
              @tag="$emit('addActivity', $event)"
            />
          </template>
        </Field>

        <Field
          label="expense category:"
          :value="transaction?.expenseCategory"
        />

        <Field label="narration:" :value="transaction?.narration" />

        <Field v-if="sub && sub.length" label="sub transactions:">
          <template #value>
            <ul style="margin-bottom: 0.5em">
              <li v-for="txn in sub" :key="txn.id">
                <a
                  href="#"
                  class="sub-transaction"
                  @click.stop="$emit('select', txn.id)"
                >
                  {{ txn.expenseCategory }} - &#8358;{{
                    Math.abs(txn.displayAmount)
                  }}
                </a>
                <br />
              </li>
            </ul>
          </template>
        </Field>

        <Field v-if="parent" label="parent transaction:">
          <template #value>
            <ul style="margin-bottom: 0.5em">
              <li>
                <a
                  href="#"
                  class="sub-transaction"
                  @click.stop="$emit('select', parent.id)"
                >
                  {{ parent.displayCategory }} - &#8358;{{
                    Math.abs(parent.amount)
                  }}
                </a>
                <br />
              </li>
            </ul>
          </template>
        </Field>

        <div class="form-buttons">
          <input
            type="button"
            style="width: unset !important; height: unset !important"
            value="SUBMIT"
            class="button button--primary"
            @click.stop="$emit('saveEdit', model)"
          />
          <input
            type="button"
            class="button"
            style="width: unset !important; height: unset !important"
            @click.stop="$emit('cancel')"
            value="CANCEL"
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
import { TRANSACTION_CATEGORIES } from "@/config";
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
    categories() {
      return TRANSACTION_CATEGORIES;
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
.transaction__body {
  margin-top: 2em;
}
.multiselect {
  margin: 0;
}
.form-buttons {
  margin-top: 2em;
  display: flex;
  justify-content: space-around;

  .button {
    font-weight: 800;
    border: 1px solid #007cff;
    background: white;
    color: #007cff;
    min-width: 150px;
    cursor: pointer;
    margin: 0;
    font-size: 1em;
    padding: 1em;

    border-radius: 5px;

    &--primary {
      background: #007cff;
      color: white;
    }
  }
}
p span:first-child {
  font-weight: 700;
}
form input {
  height: 1.5em;
}
ul {
  list-style-type: disclosure-closed;
}
@media screen and (max-width: 991px) {
  .form-buttons {
    display: flex;
    margin-top: unset;
  }
  form p {
    margin-top: 1em;
    padding-top: 0;
  }
  label input {
    display: inline;
  }
}
</style>
