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
      <div v-if="!splitTransaction">
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
            <!-- 
            <p><span class="small-text accent-color">note: </span> <br /></p>
            <textarea name="" id="" cols="30" rows="10"></textarea> -->

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
      <div id="split-transaction" v-else>
        <div
          id="split-header"
          style="
            padding: 1em 1em 0.5em;
            margin-bottom: 1.5em;
            border-bottom: 1px solid #ddd;
            text-align: center;
          "
        >
          <h3>Split transaction</h3>
          <p>
            Total Amount:
            <span style="font-size: 1.1em; font-weight: 300">
              N{{ Math.abs(singleTransaction.amount) }}</span
            >
          </p>
        </div>
        <p class="small-text">
          The total of each split amount should be equal to the total of the
          initial transaction. Adjust the amount already entered or use the
          button below to add a new split.
        </p>
        <form action="#" id="transaction-split-form">
          <div
            class="split-item-container"
            v-for="(item, index) in splitTransactionData"
            :key="item.id"
            @click.stop="tryDeleteSplit"
            :id="index"
            :style="{
              borderBottom:
                index === splitTransactionData.length - 1
                  ? 'none'
                  : '1px solid #ddd',
            }"
          >
            <div class="split-item">
              <p class="mid-text" style="margin-top: 0.5em">category</p>
              <Multiselect
                placeholder="Select an expense category"
                v-model="item.expenseCategory"
                :searchable="true"
                :options="[
                  { id: 1, label: 'Rent', value: 'Rent' },
                  { id: 2, label: 'Transport', value: 'Transport' },
                  { id: 3, label: 'Groceries', value: 'Groceries' },
                  { id: 4, label: 'Eating Out', value: 'EatingOut' },
                  { id: 5, label: 'Airtime', value: 'Airtime' },
                  { id: 6, label: 'Utility', value: 'Utility' },
                  { id: 7, label: 'Health', value: 'Health' },
                  { id: 8, label: 'Personal Care', value: 'PersonalCare' },
                  { id: 9, label: 'Fashion', value: 'Fashion' },
                  { id: 10, label: 'Leisure', value: 'Leisure' },
                  { id: 11, label: 'Debt Repayment', value: 'DebtRepayment' },
                  { id: 12, label: 'Loans', value: 'Loans' },
                  {
                    id: 13,
                    label: 'Personal Development',
                    value: 'PersonalDevelopment',
                  },
                  {
                    id: 14,
                    label: 'Savings & Investments',
                    value: 'SavingsAndInvestments',
                  },
                  {
                    id: 15,
                    label: 'Charity & Gifts',
                    value: 'CharityAndGifts',
                  },
                  { id: 16, label: 'Vacation', value: 'Vacation' },
                  { id: 17, label: 'Vehicle Expense', value: 'VehicleExpense' },
                  { id: 18, label: 'House Expense', value: 'HouseExpense' },
                  { id: 19, label: 'Child Care', value: 'ChildCare' },
                  { id: 20, label: 'Others', value: 'Others' },
                ]"
                noResultsText="No result found"
              />

              <p>amount</p>
              <input
                type="number"
                style="height: 2.5em; padding: 0.5em 1em; color: black"
                min="0"
                v-model="item.amount"
              />
            </div>
            <span
              class="material-icons delete-split-item"
              style="margin-top: 2em; color: red"
            >
              delete
            </span>
          </div>

          <button
            style="
              font-size: 0.9em;
              background-color: transparent;
              border: none;
              display: block;
              text-align: center;
              padding: 1em;
              width: 100%;
              cursor: pointer;
              margin-top: 1em;
              margin-bottom: 2em;
              color: #007cff;
            "
            @click="incrementSplitCount"
          >
            <span>+ Add New Split</span>
          </button>

          <div class="form-buttons">
            <input
              type="submit"
              style="width: unset !important; height: unset !important"
              :disabled="enableSplitSubmit"
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

      <div class="form-buttons" v-if="!editTransaction && !splitTransaction">
        <input
          type="submit"
          @click.stop="enableEditTransaction"
          v-if="
            !['Bank Charge', 'Inflow'].includes(
              singleTransaction?.displayCategory
            )
          "
          value="Edit Transaction"
        />
        <input
          type="submit"
          @click.stop="enableSplitTransaction"
          v-if="
            !['Bank Charge', 'Inflow'].includes(
              singleTransaction?.displayCategory
            )
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
import { mapGetters } from "vuex";
import { notify } from "@kyvg/vue3-notification";
import { Transaction } from "@/types";

@Options({
  created() {
    this.$store.dispatch("getEstablishments");
  },
  // mounted() {
  //   console.log("mounted is being called");
  //   this.splitTransactionData = this.childTransactions?.length
  //     ? this.childTransactions.map((x: Transaction) => {
  //         return {
  //           expenseCategory: x.expenseCategory,
  //           amount: Math.abs(x.amount),
  //           id: x.id,
  //         };
  //       })
  //     : [{ expenseCategory: "", amount: 0, id: "" }];
  // },
  // beforeUpdate() {
  //   // disable the edit form if the user clicks on another transaction
  //   if (this.transactionId && this.transactionId != this.singleTransaction.id) {
  //     this.disableEditTransaction();
  //   }
  // },
  props: {
    singleTransaction: Object,
    closeFunction: Function,
    parentTransaction: Object,
    childTransactions: Object,
  },
  data() {
    return {
      editTransaction: false,
      isBusinessEstablishment: null,
      editFormSubmitted: null,
      editedTransaction: null,
      transactionId: null,
      expenseCategory: null,
      splitTransactionData: null,
      splitTransaction: false,
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
    enableSplitSubmit() {
      return this.splitTransactionData.some(
        (x: { expenseCategory: string; amount: number }) =>
          x.expenseCategory && x.amount
      );
    },
  },
  methods: {
    enableSplitTransaction() {
      this.splitTransaction = true;
    },
    tryDeleteSplit(e: Event) {
      if (
        ((e.target as any).className as string).includes("delete-split-item")
      ) {
        this.splitTransactionData.splice((e.currentTarget as any).id, 1);
      }
    },
    incrementSplitCount(e: Event) {
      console.log("increment split", { e });
      this.splitTransactionData.push({
        expenseCategory: "",
        amount: 0,
        id: "",
      });

      e.stopPropagation();
      e.preventDefault();
    },
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
    disableEditTransaction(e: Event) {
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
      this.splitTransaction = false;

      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
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
      if (this.singleTransaction) {
        this.editFormSubmitted = true;

        const updatedTransaction = { ...this.singleTransaction };
        updatedTransaction.displayCategory = this.editedTransaction.displayCategory;
        updatedTransaction.recipient = this.editedTransaction.recipientName[0];
        if (this.editedTransaction.isEstablishment) {
          updatedTransaction.establishment =
            this.singleTransaction.establishment || {};
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
              this.disableEditTransaction();
              notify({
                text: "Transaction update was successful",
                type: "success",
              });
              this.closeFunction();
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
  watch: {
    singleTransaction(newVal: Transaction, oldVal: Transaction) {
      if (newVal.id !== oldVal?.id) {
        this.disableEditTransaction();

        this.splitTransactionData = this.childTransactions?.length
          ? this.childTransactions.map((x: Transaction) => {
              return {
                expenseCategory: x.expenseCategory,
                amount: Math.abs(x.amount),
                id: x.id,
              };
            })
          : [{ expenseCategory: "", amount: 0, id: "" }];
      }
    },
  },
})
export default class SingleTransaction extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
#single-transaction {
  width: 33%;
  margin: 1% 1% 0px;
  height: 94vh;
  padding: 1em;
  overflow: scroll;
}
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
  padding: 1em 1em 3em;
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
  font-weight: 800;
  border: 1px solid #007cff;
}
p span:first-child {
  font-weight: 700;
}
form input {
  height: 1.5em;
}
.cancel-button {
  color: #007cff;
  background-color: white;
}
#close {
  display: none;
  cursor: pointer;
}
.split-item-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  padding-bottom: 1em;
}
#transaction-split-form .split-item-container:last-of-type {
  border-bottom: none;
}
.split-item {
  width: 85%;
}
.split-item input {
  width: 100%;
}
.split-item p {
  margin-top: 0.5em;
}
#transaction-split-form .split-item-container:first-of-type .delete-split-item {
  display: none;
}
.delete-split-item {
  cursor: pointer;
}
@media screen and (max-width: 991px) {
  .form-buttons {
    display: flex;
    margin-top: unset;
  }

  #single-transaction {
    width: 90%;
    position: absolute;
    z-index: -1000;
    top: 7%;
    background: white;
    margin: 0 5%;
    height: 85vh;
    padding: 0 1em;
  }
  #close {
    display: block;
    text-align: end;
    padding: 0.5em 1em;
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
