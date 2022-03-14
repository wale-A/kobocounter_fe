<template>
  <Page>
    <div class="dashboard" @click="outsideClickHandler">
      <section class="dashboard-content-container">
        <div class="dashboard-content">
          <SingleTransaction
            :singleTransaction="singleTransaction"
            :childTransactions="childTransactions"
            :parentTransaction="parentTransaction"
            :establishments="establishments"
          />
          <Card title="All Transactions" class="all-transactions">
            <section id="all-transactions-container">
              <table>
                <tr
                  v-for="date in Object.keys(groupedTransactions)"
                  :key="date"
                >
                  <!-- <td colspan="2" style="width: 100%">
                  {{ date }}
                </td> -->
                  <p>{{ date }}</p>
                  <table class="transactions-table">
                    <tr
                      v-for="txn in groupedTransactions[date]"
                      :key="txn.id"
                      :id="txn.id"
                      class="txn"
                      :class="{
                        'selected-transaction':
                          singleTransaction && txn.id === singleTransaction.id,
                      }"
                      @click.stop="selectTransaction(txn.id)"
                    >
                      <td>
                        <!-- txn.narration.replace(/\s{4,}/g, "").trim() -->
                        <div>
                          <img
                            :alt="`${
                              txn.expenseCategory || txn.displayCategory
                            }`"
                            :src="`/img/categories/${(
                              txn.expenseCategory?.trim() ||
                              txn.displayCategory?.trim() ||
                              'null'
                            ).toLowerCase()}.svg`"
                          />
                          {{ txn.expenseCategory || txn.displayCategory }}
                        </div>
                      </td>
                      <!-- <td class="date">
                      {{ new Date(txn.date).toDateString() }}
                    </td> -->
                      <td>
                        <span
                          :style="{
                            color:
                              (txn.amount || txn.displayAmount) > 0
                                ? 'green'
                                : 'red',
                          }"
                        >
                          {{
                            parseFloat(
                              (txn.amount || txn.displayAmount).toFixed(2)
                            ).toLocaleString()
                          }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </tr>
              </table>
            </section>
          </Card>
        </div>
      </section>
      <!-- <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" /> -->
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters, mapActions } from "vuex";
import Card from "@/components/layout/Card.vue";
import Page from "@/components/layout/Page.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";
import { SplitTransaction, Transaction } from "@/types";
import SingleTransaction from "@/components/transaction/SingleTransaction.vue";

@Options({
  created() {
    this.getTransactions({
      accountId: undefined,
      start: undefined,
      end: undefined,
    });
    this.getEstablishments();
  },
  data() {
    return {
      singleTransaction: null,
      parentTransaction: null,
      childTransactions: null,
    };
  },
  components: {
    Card,
    Page,
    AddNewAccount,
    SingleTransaction,
  },
  computed: {
    ...mapGetters(["accounts", "transactions", "establishments"]),
    groupedTransactions: function () {
      const sortedTransactions = [...(this.transactions ?? [])].sort(
        (x: Transaction, y: Transaction) => y.date - x.date
      );
      const group: Record<string, Transaction[]> = {};
      for (let i = 0; i < sortedTransactions?.length || 0; i++) {
        const date = new Date(sortedTransactions[i].date).toDateString();
        const txn = sortedTransactions[i] as Transaction;
        group[date] = (group[date] || []).concat(txn);
      }
      return group;
    },
  },
  methods: {
    ...mapActions([
      "getTransactions",
      "updateTransaction",
      "saveSplitTransactions",
      "getEstablishments",
    ]),
    selectTransaction(transactionId: string) {
      this.singleTransaction = this.transactions.find(
        (x: Transaction) => x.id === transactionId
      );
      this.childTransactions = this.transactions?.filter(
        (x: Transaction) => x.parentId === transactionId
      );
      this.parentTransaction = this.transactions?.find(
        (x: Transaction) => x.id === this.singleTransaction?.parentId
      );
      console.log(this.childTransactions, this.parentTransaction);
    },
    outsideClickHandler() {
      this.singleTransaction = null;
      this.childTransactions = null;
      this.parentTransaction = null;
    },
    editTransaction(model: Transaction) {
      this.updateTransaction({
        transactionId: this.editedTransaction.id,
        params: {
          ...this.model,
          recipientName: this.model.recipientName[0],
        },
        model,
      })
        .then(() => {
          this.$notify({
            text: "Transaction update was successful",
            type: "success",
          });
        })
        .catch(() => {
          this.$notify({
            text: "Transaction update failed, please retry",
            type: "error",
          });
        });
    },
    splitTransaction(model: SplitTransaction[]) {
      this.saveSplitTransactions({
        transactionId: this.singleTransaction.id,
        params: model,
      })
        .then(() => {
          this.$notify({
            text: "Transaction split was successful",
            type: "success",
          });
        })
        .catch(() => {
          this.$notify({
            text: "Transaction split failed, please retry",
            type: "error",
          });
        });
    },
  },
})
export default class Transactions extends Vue {}
</script>

<style scoped>
main {
  height: 100vh;
  overflow: hidden;
}
td {
  padding: 0;
  margin: 0;
}
.all-transactions {
  width: 64%;
  margin: 1%;
  margin-right: 0;
  margin-bottom: 0;
  padding: 1em;
  height: 94vh;
  background: white;
}
#all-transactions-container {
  overflow: scroll;
  height: 98%;
}
.all-transactions-transaction-info {
  justify-content: space-between;
  margin: 0.5em 0;
  padding: 0.5em 1em;
}
table {
  font-size: 1em;
  table-layout: fixed;
  width: 100%;
  border-spacing: 0;
}
td {
  border-bottom: 1px solid #d9dbdb;
  padding: 0.5em;
}
tr p {
  padding: 0.5em;
  border-bottom: 1px solid #727376;
  text-align: start;
  font-size: 0.9em;
  font-weight: 800;
  margin-top: 1em;
}
tr p:first-child {
  margin-top: 0.5em;
}
td:first-child {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.1em 1em;
  text-align: start;
}
td:last-child {
  text-align: end;
  padding-right: 1em;
}
.transactions-table tr:hover {
  cursor: pointer;
  font-weight: 800;
  background-color: #f0f0f0;
}
.transactions-table tr:hover td:first-child {
  border-left: 1px solid #d9dbdb;
}
.transactions-table tr:hover td:last-child {
  border-right: 1px solid #d9dbdb;
}
.selected-transaction {
  background-color: #dcdcdc;
}
td img {
  margin-right: 1em;
}
td div {
  display: flex;
  align-items: center;
}

/*responsive*/
@media (max-width: 991px) {
  #all-transactions-container {
    margin-bottom: 7vh;
    height: 80vh;
  }
  table {
    border-spacing: 0;
  }
  td:first-child {
    width: 70%;
    padding: 0.4em;
  }
  td:last-child {
    padding-right: 0em;
  }

  .all-transactions {
    width: 100%;
    height: 88vh;
  }
  .dashboard {
    flex-flow: unset;
  }
}
</style>
