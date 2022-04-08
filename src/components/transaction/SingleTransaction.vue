<template>
  <div
    id="single-transaction"
    class="bordered-container"
    :class="{ float }"
    @click.stop=""
  >
    <div v-if="onMobile" id="close" @click="float = false">
      <span class="material-icons"> close </span>
    </div>
    <div id="no-transaction" v-if="!singleTransaction">
      <img src="/img/assets/no-transaction.svg" alt="no-transactions" />
      <p>You have not selected a transaction</p>
      <p>Select a transaction on the left to see it's details</p>
    </div>

    <template v-else>
      <div v-if="active === 'view'" id="transaction-detail" class="pane">
        <View
          :transaction="singleTransaction"
          :parent="parentTransaction"
          :sub="childTransactions"
          @edit="onAction('edit')"
          @split="onAction('split')"
          @select="$emit('select', $event)"
        />
      </div>
      <div v-else id="transaction-detail" class="pane">
        <component
          :is="components[active]"
          :transaction="singleTransaction"
          :parent="parentTransaction"
          :sub="childTransactions"
          :establishments="establishments"
          @select="$emit('select', $event)"
          @addEstablishment="$emit('addEstablishment', $event)"
          @addActivity="$emit('addActivity', $event)"
          @saveEdit="$emit('saveEdit', $event)"
          @saveSplit="$emit('saveSplit', $event)"
          @cancel="onAction('cancel')"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import View from "./View.vue";
import Edit from "./Edit.vue";
import Split from "./Split.vue";

@Options({
  props: {
    singleTransaction: Object,
    parentTransaction: Object,
    childTransactions: Array,
    establishments: Object,
  },
  data() {
    return {
      active: "view",
      float: false,
    };
  },
  components: {
    Edit,
    View,
    Split,
  },
  computed: {
    components() {
      return {
        split: "Split",
        edit: "Edit",
      };
    },
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
  watch: {
    singleTransaction() {
      this.active = "view";
      if (this.onMobile) {
        this.float = true;
      }
    },
  },
  methods: {
    // TODO: Move this logic up
    onAction(key: string, value: any) {
      switch (key) {
        case "edit":
          this.active = "edit";
          break;
        case "split":
          this.active = "split";
          break;
        case "cancel":
          this.active = "view";
          break;
        default:
          this.active = "view";
      }
    },
  },
})
export default class Transaction extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
#split-transaction-summary {
  text-align: center;
}
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
  height: 94%;
}
#no-transaction p {
  margin: 1em 0 0;
}
#transaction-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 94%;
  padding: 1em 1em 3em;
}
#transaction-detail form {
  margin-top: 2em;
}
.form-buttons {
  margin-top: 2em;
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
ul {
  list-style-type: disclosure-closed;
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
    height: 84vh;
    padding: 0 1em;
  }

  #single-transaction.float {
    z-index: 5 !important;
  }
  #close {
    display: block;
    text-align: end;
    padding: 0.5em 1em 0em;
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
