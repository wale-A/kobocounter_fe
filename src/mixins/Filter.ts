import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import dateFormat from "dateformat";
import { baseFilter } from "@/util";

@Options({ computed: { ...mapGetters(["accountMap", "accountOptionsMap"]) } })
export default class Filter extends Vue {
  public accountMap!: Record<string, any>;
  public accountOptionsMap!: Record<string, any>;
  params: Record<string, any> = {};
  filterFields: Record<string, any> = baseFilter;

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

  get getparamSummary(): string {
    if (this.params) {
      const bank = this.accountMap[this.params.account]
        ? `${this.accountMap[this.params.account].bankName} Account`
        : "All Bank Accounts";
      return `Showing ${bank} from ${this.from} to ${this.to}`;
    }
    return "";
  }

  get to(): string {
    // TODO: use filter
    return this.formatDate(this.params?.period.end);
  }

  get from(): string {
    // TODO: use filter
    return this.formatDate(this.params?.period.start);
  }

  setParams(params: any): void {
    this.params = params;
  }

  formatDate(date: Date): string {
    return dateFormat(date, "yyyy-mm-dd");
  }

  getModels(facets: Record<string, any>[]): Record<string, any> {
    return facets.reduce((acc, facet) => {
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
}