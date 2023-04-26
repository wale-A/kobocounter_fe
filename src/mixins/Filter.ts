import { baseFilter } from "@/util";
import dateFormat from "dateformat";
import { Options, Vue } from "vue-class-component";
import { mapGetters, mapMutations } from "vuex";

@Options({
  computed: {
    ...mapGetters(["accountMap", "accountOptionsMap", "filters"]),
  },
  methods: {
    ...mapMutations(["setFilters"]),
  },
})
export default class Filter extends Vue {
  filterFields: Record<string, any> = baseFilter;
  accountOptionsMap!: Record<string, any>;
  setFilters!: (params: Record<string, any>) => void;
  filters!: Record<string, any>;

  get filterArgs(): Record<string, any> {
    return {
      account: this.accountOptionsMap,
    };
  }

  get facets(): Record<string, any>[] {
    if (!this.filterFields) {
      return [];
    }
    return Object.keys(this.filterFields).map((key) => {
      if (
        typeof this.filterFields[key] === "function" &&
        this.filterArgs[key]
      ) {
        return this.filterFields[key](this.filterArgs[key]);
      }
      return this.filterFields[key];
    });
  }

  accountMap!: Record<string, any>;
  get paramSummary(): string {
    if (this.filters) {
      const bank = this.accountMap[this.filters.account]
        ? `${this.accountMap[this.filters.account].bankName} Account`
        : "All Bank Accounts";
      return `Showing results for ${bank} from ${this.from} to ${this.to}`;
    }
    return "";
  }

  get to(): string {
    // TODO: use filter
    return this.formatDate(this.filters?.period.end);
  }

  get from(): string {
    // TODO: use filter
    return this.formatDate(this.filters?.period.start);
  }

  setParams(params: any): void {
    this.setFilters(params);
  }

  formatDate(date: Date): string {
    return dateFormat(date, "yyyy-mm-dd");
  }

  getModels(facets: Record<string, any>[]): Record<string, any> {
    const facetData = facets.reduce((acc, facet) => {
      let value;
      if (typeof facet.modelDefault === "function") {
        value = facet.modelDefault();
      } else {
        value = facet.modelDefault;
      }
      return {
        ...acc,
        [facet.key]: value,
      };
    }, {});

    return { ...facetData, ...this.filters };
  }

  getQuery(
    facets: Record<string, any>[],
    model: Record<string, any>
  ): Record<string, string> {
    return facets.reduce(
      (acc: Record<string, string>, item: Record<string, any>) => {
        return {
          ...acc,
          ...item.getParams(model),
        };
      },
      {}
    );
  }

  addAccount(cb: () => void | undefined): void {
    const addAccountFn = (code: string) => {
      this.$store.dispatch("addAccount", { code }).then(() => {
        if (cb) {
          cb();
        }
      });
    };
    const options = {
      onSuccess: function (response: { code: string }) {
        addAccountFn(response.code);
      },
    };
    this.$launchMono(options);
  }
}
