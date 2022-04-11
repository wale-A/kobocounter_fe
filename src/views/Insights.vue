<template>
  <Page>
    <template v-slot:actions>
      <Filter
        :displayText="paramSummary.value"
        :fields="facets.value"
        :model="{ ...params.value }"
        @filter="setParams($event)"
        @update:account="addAccount"
      />
    </template>
    <div>
      <section class="dashboard-content-container">
        <div class="dashboard-content">
          <!-- <div id="single-analysis"></div> -->
          <Card title="Insights" class="all-transactions">
            <section id="all-transactions-container">
              <table id="analysis-table">
                <tr class="analysis-item" v-for="i in 11" :key="i">
                  <td class="" style="width: 50%">
                    <div>
                      <img src="/img/categories/misc.svg" />
                      <div class="progress-section">
                        <span>
                          {{
                            [
                              "Groceries",
                              "Airtime",
                              "Transfer",
                              "Rent",
                              "Eating Out",
                              "Leisure",
                              "Personal Development",
                              "Utility",
                              "Bank Charge",
                              "Airtime / Mobile Data",
                            ][Math.floor(Math.random() * 10)]
                          }}
                        </span>
                        <progress max="100" value="70"></progress>
                      </div>
                    </div>
                  </td>
                  <td class="amount-change">
                    <span class="percentage-change-amount">{{
                      (Math.random() * 100).toFixed(2)
                    }}</span>
                    <span style="font-size: 0.8em">%</span>
                    <span
                      v-if="Math.random() < 0.5"
                      style="color: #ff3333"
                      class="percentage-change-direction material-icons bold-text"
                    >
                      trending_down</span
                    >
                    <span
                      v-else
                      style="color: #33cd33"
                      class="percentage-change-direction material-icons bold-text"
                    >
                      trending_up
                    </span>
                  </td>
                  <td>
                    <span style="">
                      {{ (Math.random() * 100000).toLocaleString() }}
                    </span>
                  </td>
                </tr>
              </table>
            </section>
          </Card>
        </div>
      </section>
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";
import Page from "@/components/layout/Page.vue";
import Filter from "@/components/common/Filter.vue";

@Options({
  components: {
    Card,
    Filter,
    Page,
  },
  inject: [
    "params",
    "facets",
    "queryParams",
    "paramSummary",
    "to",
    "from",
    "setParams",
    "addAccount",
  ],
  watch: {
    "queryParams.value"(newVal) {
      console.log(newVal);
    },
  },
})
export default class Insights extends Vue {}
</script>

<style scoped>
/* table,
tr,
td {
  border: 1px solid black;
} */
td {
  text-align: center;
  padding: 0.3em 0 0.8em;
  border-bottom: 1px solid black;
}
main {
  height: 100vh;
  overflow: hidden;
}
/* td {
  padding: 0;
  margin: 0;
} */
.all-transactions {
  width: 98%;
  margin: 1%;
  padding: 1em;
  height: 94vh;
  background: white;
}
#all-transactions-container {
  overflow: scroll;
  height: 98%;
  margin-top: 1em;
}
table {
  font-size: 1em;
  table-layout: fixed;
  width: 100%;
  border-spacing: 0;
}
#analysis-table tr:hover {
  cursor: pointer;
  font-weight: 800;
  background-color: #f0f0f0;
}
td img {
  margin-right: 1em;
}
td div {
  display: flex;
  align-items: center;
}
.progress-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0.4em;
  justify-content: flex-start;
  align-items: flex-start;
}
progress {
  width: 100%;
  color: black;
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
  .dashboard {
    flex-flow: unset;
  }
}
</style>
