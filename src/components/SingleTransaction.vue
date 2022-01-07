<template>
  <div id="single-transaction" class="bordered-container" @click.stop="">
    <div id="no-transaction" v-if="!singleTransaction">
      <img src="/img/assets/no-transaction.svg" alt="no-transactions" />
      <p>You have not selected a transaction</p>
      <p>Select a transaction on the left to see it's details</p>
    </div>

    <div id="close" @click.stop="closeFunction()">
      <span class="material-icons"> close </span>
      <br />
    </div>
    <div id="transaction-detail" v-if="singleTransaction">
      <div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <img
            :alt="`${singleTransaction?.bank} logo`"
            :src="`/img/banks/${singleTransaction?.bank}.svg`"
            id="bank-logo"
            style="height: 5em"
          />
          <!-- onerror="https://ui-avatars.com/api/?size=50&format=svg" -->
          <span class="mid-text darker-color">
            {{ new Date(singleTransaction?.date).toLocaleDateString("en-GB") }}
            <br />
            {{
              new Date(singleTransaction?.date).toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </span>
        </div>
        <div style="text-align: start">
          <form action="#" @submit.prevent="saveEditedTransaction">
            <p class="mid-text">
              <span class="small-text accent-color"
                >transaction category:
              </span>
              <br />
              <span v-show="!editTransaction">
                {{
                  singleTransaction?.expenseCategory?.trim() ||
                  singleTransaction?.displayCategory?.trim() ||
                  "-"
                }}
              </span>
            </p>
            <Multiselect
              :disabled="editFormSubmitted"
              :searchable="true"
              v-if="editTransaction"
              placeholder="Transaction category"
              v-model="editedTransaction.displayCategory"
              :options="[
                'Misc',
                'ATM Withdrawal',
                'Bank Charge',
                'POS Purchase',
                'WEB Purchase',
                'Airtime',
                'Mobile Data',
                'Transfer',
              ]"
              noResultsText="No result found"
            />

            <p class="mid-text">
              <span class="small-text accent-color">amount: </span> <br />
              <span style="font-weight: 800; font-size: large">&#8358; </span>
              <span
                :style="{
                  'font-weight': 500,
                  color:
                    singleTransaction?.amount < 0
                      ? 'rgba(255, 10, 10, 0.7)'
                      : 'rgb(20, 180, 20)',
                }"
              >
                {{ Math.abs(singleTransaction?.amount).toLocaleString() }}
              </span>
            </p>

            <p class="mid-text">
              <!-- v-show="
                (singleTransaction?.establishment?.name ||
                  singleTransaction?.recipient) &&
                !editTransaction
              " -->
              <span class="small-text accent-color">recipient: </span> <br />
              <span v-show="!editTransaction">
                {{
                  singleTransaction?.establishment?.name ||
                  singleTransaction?.recipient ||
                  "-"
                }}
              </span>
            </p>
            <Multiselect
              :disabled="editFormSubmitted"
              v-if="editTransaction"
              :searchable="true"
              placeholder="Recipient"
              v-model="editedTransaction.recipientName"
              :options="allEstablishments"
              :createTag="true"
              mode="tags"
              :max="Number('1')"
              @tag="addEstablishment"
              @change="changedEstablishment"
            />

            <div style="margin-top: 1em">
              <label for="business-establishment" v-if="editTransaction">
                <input
                  v-if="editTransaction"
                  id="business-establishment"
                  name="business-establishment"
                  type="checkbox"
                  :checked="singleTransaction?.establishment?.name"
                  v-model="editedTransaction.isEstablishment"
                  :disabled="
                    !editFormSubmitted && !editedTransaction?.recipientName[0]
                  "
                  style="width: unset !important; vertical-align: bottom"
                />
                Recipient is a business establishment
              </label>
            </div>

            <p class="mid-text">
              <!-- v-if="
                singleTransaction?.establishment?.activities &&
                singleTransaction?.establishment?.activities.length > 0 &&
                !editTransaction
              " -->
              <span class="small-text accent-color">business activity: </span>
              <br />
              <span v-if="!editTransaction">
                {{
                  singleTransaction?.establishment?.activities
                    ?.join(", ")
                    ?.trim() || "-"
                }}
              </span>
            </p>
            <Multiselect
              :disabled="editFormSubmitted"
              :searchable="true"
              v-if="
                editTransaction &&
                editedTransaction.recipientName.length === 1 &&
                editedTransaction.isEstablishment
              "
              placeholder="Establishment's activites"
              v-model="editedTransaction.establishmentActivities"
              :options="allActivities"
              mode="tags"
              :createTag="true"
              @tag="addActivity"
            />

            <p class="mid-text">
              <span class="small-text accent-color">expense category: </span>
              <br />
              {{ singleTransaction?.expenseCategory || "-" }}
            </p>

            <p class="mid-text" style="overflow-wrap: break-word">
              <span class="small-text accent-color">narration: </span> <br />
              {{ singleTransaction?.narration }}
            </p>

            <div v-if="editTransaction" class="form-buttons">
              <input
                type="submit"
                style="width: unset !important; height: unset !important"
                :disabled="editFormSubmitted"
                value="SUBMIT"
              />
              <input
                type="submit"
                class="cancel-button"
                style="width: unset !important; height: unset !important"
                :disabled="editFormSubmitted"
                @click.stop="disableEditTransaction"
                value="CANCEL"
              />
            </div>
          </form>
        </div>
      </div>
      <div class="form-buttons">
        <input
          type="submit"
          @click.stop="enableEditTransaction"
          v-if="
            !['Bank Charge', 'Inflow'].includes(
              singleTransaction?.displayCategory
            ) && !editTransaction
          "
          value="Edit Transaction"
        />
        <input
          type="submit"
          @click.stop="disableEditTransaction"
          v-if="
            !['Bank Charge', 'Inflow'].includes(
              singleTransaction?.displayCategory
            ) && !editTransaction
          "
          class="cancel-button"
          value="Split Transaction"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import { TransactionInfo } from "@/types";
import { mapGetters } from "vuex";
import { notify } from "@kyvg/vue3-notification";

@Options({
  created() {
    this.$store.dispatch("getEstablishments");
  },
  beforeUpdate() {
    // disable the edit form if the user clicks on another transaction
    if (this.transactionId && this.transactionId != this.singleTransaction.id) {
      this.disableEditTransaction();
    }
  },
  props: {
    singleTransaction: Object,
    closeFunction: Function,
  },
  data() {
    return {
      editTransaction: false,
      isBusinessEstablishment: undefined,
      editFormSubmitted: undefined,
      editedTransaction: undefined,
      transactionId: undefined,
    };
  },
  components: {
    Multiselect,
  },
  computed: {
    ...mapGetters(["establishments"]),
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
  },
  methods: {
    enableEditTransaction() {
      if (!this.singleTransaction) return;

      this.editTransaction = true;
      this.isBusinessEstablishment = !!this.singleTransaction?.establishment
        ?.name;
      this.editedTransaction = {
        id: this.singleTransaction.id,
        displayCategory: this.singleTransaction.displayCategory,
        recipientName: this.singleTransaction?.establishment?.name
          ? [this.singleTransaction?.establishment?.name]
          : this.singleTransaction?.recipient
          ? [this.singleTransaction?.recipient]
          : [],
        isEstablishment: !!this.singleTransaction?.establishment?.name,
        establishmentActivities:
          this.singleTransaction?.establishment?.activities || [],
      };
      this.editFormSubmitted = false;
      this.transactionId = this.singleTransaction.id;
    },
    disableEditTransaction() {
      this.editTransaction = false;
      this.isBusinessEstablishment = false;
      this.editedTransaction = {
        id: undefined,
        displayCategory: "",
        recipientName: [],
        recipientActivities: [],
        isEstablishment: false,
      };
      this.editFormSubmitted = false;
      this.transactionId = null;
    },
    addActivity(activity: string) {
      this.$store.commit("insertActivity", activity);
    },
    addEstablishment(establishment: string) {
      this.$store.commit("insertEstablishment", establishment);
    },
    changedEstablishment(val: string[]) {
      let activities = [];
      if (val && val.length > 0) {
        activities = this.establishments[val[0]] || [];
      }
      this.editedTransaction.establishmentActivities = activities;
      this.editedTransaction.isEstablishment = activities.length > 0;
    },
    saveEditedTransaction() {
      const txn = this.transactions.find(
        (x: TransactionInfo) => x.id === this.editedTransaction.id
      );
      if (txn) {
        this.editFormSubmitted = true;

        const updatedTransaction = { ...txn };
        updatedTransaction.displayCategory = this.editedTransaction.displayCategory;
        updatedTransaction.recipient = this.editedTransaction.recipientName[0];
        if (this.editedTransaction.isEstablishment) {
          updatedTransaction.establishment = txn.establishment || {};
          updatedTransaction.establishment.activities = this.editedTransaction.establishmentActivities;
          updatedTransaction.establishment.name = this.editedTransaction.recipientName[0];
        } else {
          updatedTransaction.establishment = {} as any;
        }

        this.$store.dispatch("updateTransaction", {
          transactionId: this.editedTransaction.id,
          params: {
            ...this.editedTransaction,
            recipientName: this.editedTransaction.recipientName[0],
          },
          updatedTransaction,
          callback: (success: boolean) => {
            if (success) {
              this.singleTransaction = updatedTransaction;
              this.modalTransactions.transactions.splice(
                this.modalTransactions.transactions.findIndex(
                  (x: TransactionInfo) => x.id == updatedTransaction.id
                ),
                1,
                updatedTransaction
              );
              this.disableEditTransaction();
              notify({
                text: "Transaction update was successful",
                type: "success",
              });
            } else {
              this.editFormSubmitted = false;
              notify({
                text: "Transaction update failed, please retry",
                type: "error",
              });
            }
          },
        });
      }
    },
  },
})
export default class SingleTransaction extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
#single-transaction #no-transaction {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
#no-transaction p {
  margin: 1em 0 0;
}
#transaction-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1em;
}
#transaction-detail form {
  margin-top: 2em;
}
.form-buttons {
  margin-top: 3em;
  display: flex;
  justify-content: space-around;
}
input[type="submit"] {
  border-radius: 1em;
  font-weight: 800;
}
p span:first-child {
  font-weight: 700;
}
form input {
  height: 1.5em;
}
.multiselect-search input {
  background: transparent;
}
.cancel-button {
  color: #007cff;
  background-color: white;
  border: 1px solid #007cff;
}
#close {
  display: none;
}
@media screen and (max-width: 700px) {
  .form-buttons {
    display: flex;
    margin-top: unset;
  }

  #single-transaction {
    width: 90%;
    position: absolute;
    z-index: -1000;
    top: 10%;
    background: white;
    margin: 0 5%;
  }
  #close {
    display: block;
    text-align: end;
    padding: 0.5em 1em 0;
  }
  #transaction-detail {
    padding: 0.5em;
  }
  #transaction-detail form {
    margin-top: 1em;
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
