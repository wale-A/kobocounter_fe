<template>
  <div
    id="single-transaction-modal"
    class="modal"
    v-show="singleTransaction && singleTransaction.id"
  >
    <div class="modal-content">
      <div class="modal-header" style="align-items: flex-end">
        <span
          id="single-transaction-close-modal"
          class="close-modal material-icons"
        >
          arrow_back
        </span>
        <span
          id="single-transaction-edit"
          v-show="
            singleTransaction?.displayCategory !== 'INFLOW' && !editTransaction
          "
          class="material-icons"
          style="margin-right: 20px; cursor: pointer"
          @click="enableEditTransaction"
        >
          create
        </span>
      </div>
      <div style="padding: 15px" v-if="singleTransaction">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          "
        >
          <img
            :alt="`${singleTransaction?.bank} logo`"
            :src="`/img/banks/${singleTransaction?.bank}.svg`"
            id="bank-logo"
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
        <div>
          <div style="text-align: start">
            <form action="#" @submit.prevent="saveEditedTransaction">
              <p class="mid-text" style="overflow-wrap: break-word">
                <span class="small-text accent-color">narration: </span> <br />
                {{ singleTransaction?.narration }}
              </p>
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
              <p
                v-show="
                  (singleTransaction?.establishment?.name ||
                    singleTransaction?.recipient) &&
                  !editTransaction
                "
                class="mid-text"
              >
                <span class="small-text accent-color">recipient: </span> <br />
                {{
                  singleTransaction?.establishment?.name ||
                  singleTransaction?.recipient
                }}
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
                />
                Is a business establishment ?
              </label>

              <p
                v-if="
                  singleTransaction?.establishment?.activities &&
                  singleTransaction?.establishment?.activities.length > 0 &&
                  !editTransaction
                "
                class="mid-text"
              >
                <span class="small-text accent-color">business activity: </span>
                <br />
                {{ singleTransaction?.establishment?.activities?.join(", ") }}
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
                style="margin-top: 25px"
                @tag="addActivity"
              />

              <p class="mid-text" v-show="!editTransaction">
                <span class="small-text accent-color"
                  >transaction category:
                </span>
                <br />
                {{ singleTransaction?.displayCategory }}
              </p>
              <Multiselect
                :disabled="editFormSubmitted"
                :searchable="true"
                v-if="editTransaction"
                placeholder="Transaction category"
                v-model="editedTransaction.displayCategory"
                :options="[
                  'MISC',
                  'ATM WITHDRAWAL',
                  'BANK CHARGES',
                  'POS PURCHASE',
                  'WEB PURCHASE',
                  'AIRTIME',
                  'MOBILE DATA',
                  'TRANSFER',
                ]"
                noResultsText="No result found"
                style="margin-top: 35px"
              />

              <div v-if="editTransaction" id="edit-form-buttons">
                <button
                  type="submit"
                  style="background-color: #55bb55"
                  :disabled="editFormSubmitted"
                >
                  SUBMIT
                </button>
                <button
                  type="reset"
                  style="background-color: red"
                  :disabled="editFormSubmitted"
                  @click="disableEditTransaction"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import { TransactionInfo } from "@/types";
import { mapGetters } from "vuex";

@Options({
  created() {
    this.$store.dispatch("getEstablishments");
  },
  mounted() {
    this.modalMethods();
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
    },
    addActivity(activity: string) {
      this.$store.commit("insertActivity", activity);
    },
    addEstablishment(establishment: string) {
      this.$store.commit("insertEstablishment", establishment);
    },
    modalMethods() {
      const closeModal = this.close;
      const singleTransactionCloseModal = document.getElementById(
        "single-transaction-close-modal"
      );
      const singleTransactionModal = document.getElementById(
        "single-transaction-modal"
      );
      if (!(singleTransactionCloseModal && singleTransactionModal)) {
        return;
      }

      singleTransactionCloseModal.onclick = function () {
        closeModal();
      };

      window.onclick = function (event: MouseEvent) {
        if (event.target == singleTransactionModal) {
          closeModal();
        }
      };
    },
    close() {
      const modal = document.getElementById("single-transaction-close-modal");
      if (modal) {
        this.closeFunction();
        this.disableEditTransaction();
      }
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
            } else {
              this.editFormSubmitted = false;
            }
          },
        });
      }
    },
  },
})
export default class SingleTransaction extends Vue {}
</script>

<style scoped>
#bank-logo {
  width: 70px;
}
#edit-form-buttons {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}
.modal {
  display: unset;
}
button {
  margin-top: 40px;
}

@media screen and (max-width: 700px) {
  #edit-form-buttons {
    display: unset;
    margin-top: unset;
  }
}
</style>
