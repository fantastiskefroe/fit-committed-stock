<template>
  <OrderModal :order="selectedOrder"></OrderModal>

  <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Filtre</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column justify-content-between">
      <div class="container">

        <div class="row">
          <div class="col gy-3">
            <label for="fulfillmentStatusFilterInput" class="form-label">Klargøringsstatus</label>
            <div class="input-group">
              <select class="form-select form-control" id="fulfillmentStatusFilterInput"
                      v-model="filter.fulfillmentStatus">
                <option value="undefined">Alle</option>
                <option v-for="statusType in Object.values(FulfillmentStatus)"
                        v-bind:key="statusType" :value="statusType">
                  {{ statusType }}
                </option>
              </select>
              <button class="btn btn-outline-secondary" type="button" :disabled="filter.fulfillmentStatus === undefined"
                      @click="filter.fulfillmentStatus = undefined">
                Ryd
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col gy-3">
            <label for="tagFilterInput" class="form-label">Tag</label>
            <div class="input-group">
              <select id="tagFilterInput" class="form-select" v-model="filter.tag">
                <option value="undefined">Alle</option>
                <option v-for="tag in tags" v-bind:key="tag" :value="tag">{{ tag }}</option>
              </select>
              <button class="btn btn-outline-secondary" type="button" :disabled="filter.tag === undefined"
                      @click="filter.tag = undefined">
                Ryd
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col gy-3">
            <label for="skuFilterInput" class="form-label">SKU</label>
            <div class="input-group">
              <input type="text" class="form-control" id="skuFilterInput" v-model="filter.skuRegex">
              <button class="btn btn-outline-secondary" type="button" :disabled="filter.skuRegex === undefined"
                      @click="filter.skuRegex = undefined">
                Ryd
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col gy-3">
            <label for="dateRangeFilterInput" class="form-label">Tidspunkt</label>
            <Datepicker id="dateRangeFilterInput" v-model="filter.dateRange" auto-apply
                        :close-on-auto-apply="false" :clearable="false"
                        :enable-time-picker="false" :preset-ranges="presetRanges"
                        :markers="calendarMarkers"
                        range />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col text-center text-secondary">
            <span>
              {{ plural(totalNumberOfOrders, '{} ordre', '{} ordrer') }} |
              {{ plural(totalNumberOfProducts, '{} produkt', '{} produkter') }} |
              {{ plural(totalNumberOfOrderLineSummaries, '{} unikt varenummer', '{} unikke varenumre') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row my-3">
      <div class="d-md-flex flex-md-row-reverse align-items-center justify-content-between">
        <button class="btn btn-sm btn-bd-light mb-3 mb-md-0 rounded-2" type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvas"
                aria-controls="offcanvas">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               class="bi bi-gear"
               viewBox="0 0 16 16">
            <path
              d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path
              d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
          Indstillinger
        </button>
        <h1 class="display-4">Solgt Lager</h1>
      </div>
    </div>

    <div class="row">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="sticky-top bg-white">
          <tr>
            <th class="d-print-none"></th>
            <th>Titel</th>
            <th class="text-center">Antal</th>
            <th>Ordrer</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <tr v-for="summary in filteredOrderLineSummaries" v-bind:key="summary.sku"
              class="align-middle">
            <td class="text-center d-print-none">
              <img
                :src="getImageUrlByProductId(summary.productId) ?? 'https://cdn.shopify.com/s/files/1/0276/3902/1652/files/FantastiskeFroe_logo_mini_32x32.png?v=1583103209'"
                loading="lazy" class="img-thumbnail"
                :alt="summary.title">
            </td>
            <td>
              {{ summary.title }}
              <br>
              <span class="text-secondary">
              {{ summary.sku }}
            </span>
            </td>
            <td class="text-center">
              {{ summary.quantity }}
            </td>
            <td>
              <p>
                <span v-for="order in summary.orders" v-bind:key="order.number">
                  <a href="#"
                     @click="selectedOrder = order"
                     data-bs-toggle="modal" data-bs-target="#orderModal"
                     class="link-primary">{{ order.name }}</a>
                </span>
              </p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { OrdersApi } from '@/util/api';
import { CancelReasonOutput, FulfillmentStatus, type OrderLineOutput, type OrderOutput } from '@/api/shopify-data';
import { defineComponent } from 'vue';
import type { Product } from '@/types/product';
import ProductsService from '@/util/products-service';
import OrderModal from '@/components/OrderModal.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {
  addDays,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears
} from 'date-fns';

interface OrderLine {
  sku: string;
  productId: number;
  title: string;
  quantity: number;
  order: OrderOutput;
}

interface OrderLineSummary {
  sku: string;
  productId: number;
  title: string;
  quantity: number;
  orders: OrderOutput[];
}

const now = new Date();

export default defineComponent({
  components: { OrderModal, Datepicker },
  data() {
    return {
      products: [] as Product[],
      tags: [] as string[],

      orderLineSummaries: [] as OrderLineSummary[],
      selectedOrder: undefined as OrderOutput | undefined,

      filter: {
        fulfillmentStatus: FulfillmentStatus.Null as FulfillmentStatus | undefined,
        dateRange: [subDays(now, 7), now],
        skuRegex: undefined as string | undefined,
        tag: 'stalden' as string | undefined
      },
      presetRanges: [
        { label: 'I dag', range: [now, now] },
        { label: 'I går', range: [subDays(now, 1), subDays(now, 1)] },
        { label: 'Denne måned', range: [startOfMonth(now), endOfMonth(now)] },
        {
          label: 'Sidste måned',
          range: [startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))]
        },
        { label: 'I år', range: [startOfYear(now), endOfYear(now)] },
        { label: 'Sidste år', range: [startOfYear(subYears(now, 1)), endOfYear(subYears(now, 1))] }
      ]
    };
  },
  computed: {
    filteredOrderLineSummaries(): OrderLineSummary[] {
      function filterSku(filter: string | undefined): (summaries: OrderLineSummary[]) => OrderLineSummary[] {
        return (summaries: OrderLineSummary[]) => {
          if (filter === undefined || filter.trim().length === 0) {
            return summaries;
          }

          try {
            const filterRegex = RegExp(filter, 'i');
            return summaries.filter((summary) => filterRegex.test(summary.sku));
          } catch {
            return [];
          }
        };
      }

      function filterTag(tag: string | undefined, products: Product[]): (summaries: OrderLineSummary[]) => OrderLineSummary[] {
        return (summaries: OrderLineSummary[]) => {
          if (tag === undefined) {
            return summaries;
          }

          return summaries.filter((summary: OrderLineSummary) => {
            return products.find((product) => product.id === summary.productId)?.tags.includes(tag);
          });
        };
      }

      const filters = [
        filterSku(this.filter.skuRegex),
        filterTag(this.filter.tag, this.products)
      ];

      return filters.reduce((lines, filter) => filter(lines), this.orderLineSummaries);
    },
    totalNumberOfOrders(): number {
      return new Set(this.filteredOrderLineSummaries
        .flatMap((orderLineSummary: OrderLineSummary) => orderLineSummary.orders)
        .map((order: OrderOutput) => order.number)).size;
    },
    totalNumberOfProducts(): number {
      return this.filteredOrderLineSummaries
        .reduce((acc: number, current: OrderLineSummary) => acc + current.quantity, 0);
    },
    totalNumberOfOrderLineSummaries(): number {
      return this.filteredOrderLineSummaries.length;
    },
    FulfillmentStatus() {
      return FulfillmentStatus;
    },
    calendarMarkers() {
      const result: {
        date: Date | string;
        type?: 'dot' | 'line';
        color?: string;
        tooltip?: { text?: string; html?: string; color?: string }[];
      }[] = [];

      const uniqueOrderCreationDateTimes = new Set(this.filteredOrderLineSummaries
        .flatMap((summary) => summary.orders)
        .map((order) => order.created_at));
      const ordersByDate = this.groupBy(
        [...uniqueOrderCreationDateTimes],
        dateTime => startOfDay(new Date(dateTime)).toISOString());

      ordersByDate.forEach((value, key) => {
        result.push({
          date: key,
          type: 'line',
          color: getColor(value.length),
          tooltip: [{ text: this.plural(value.length, '{} ordre', '{} ordrer') }]
        });
      });

      function getColor(value: number) {
        const normalized = normalize(value, 0, 25);
        const hue = normalized * 120;
        return `hsl(${hue},75%,50%)`;
      }

      function normalize(input: number, min: number, max: number): number {
        return (input - min) / (max - min);
      }

      return result;
    }
  },
  methods: {
    fetchOrders(): void {
      ProductsService.getAll().then(products => {
        this.products = products;
        this.tags = Array.from(new Set(products.flatMap(p => p.tags))).sort();
      });

      const params = {
        from: startOfDay(this.filter.dateRange[0]) as unknown as string,
        to: startOfDay(addDays(this.filter.dateRange[1], 1)) as unknown as string,
        fulfillmentStatus: this.filter.fulfillmentStatus
      };
      OrdersApi.getOrders(params)
        .subscribe((orders: OrderOutput[]) => {
          this.orderLineSummaries = this.toOrderLineSummaries(orders);
        });
    },
    toOrderLineSummaries(orders: OrderOutput[]): OrderLineSummary[] {
      // Extract order lines
      const orderLines: OrderLine[] = orders
        .filter((order: OrderOutput) => order.cancel_reason === CancelReasonOutput.Null)
        .flatMap((order: OrderOutput) => order.line_items
          .filter((line: OrderLineOutput) => !line.refunded)
          .map((line: OrderLineOutput) => orderLineFromDTO(order, line)));

      // Group by sku
      const orderLinesBySku = this.groupBy(orderLines, line => line.sku);

      // Combine to OrderLineSummaries
      return Array.from(orderLinesBySku.values())
        .flatMap((orderLines) =>
          orderLines
            .map(toOrderLineSummary)
            .reduce(combineSummaries)
        )
        .sort((a, b) => a.title.localeCompare(b.title));

      function orderLineFromDTO(order: OrderOutput, line: OrderLineOutput): OrderLine {
        return {
          sku: line.sku,
          productId: line.product_id,
          title: line.title,
          quantity: line.quantity,
          order: order
        };
      }

      function toOrderLineSummary(orderLine: OrderLine): OrderLineSummary {
        return {
          sku: orderLine.sku,
          productId: orderLine.productId,
          quantity: orderLine.quantity,
          title: orderLine.title,
          orders: [orderLine.order]
        };
      }

      function combineSummaries(acc: OrderLineSummary, other: OrderLineSummary): OrderLineSummary {
        return {
          sku: acc.sku,
          productId: acc.productId,
          title: acc.title,
          quantity: acc.quantity + other.quantity,
          orders: acc.orders.concat(other.orders).sort((a, b) => a.name.localeCompare(b.name))
        };
      }
    },
    getImageUrlByProductId(productId: number): string | undefined {
      return this.products
        .find((product: Product) => product.id === productId)?.imgUrl;
    },
    groupBy<K, V>(list: V[], keyExtractor: (v: V) => K): Map<K, V[]> {
      return list.reduce((groups: Map<K, V[]>, value: V) => {
        const key = keyExtractor(value);
        const group = groups.get(key) ?? [];
        group.push(value);
        groups.set(key, group);
        return groups;
      }, new Map());
    },
    plural(number: number, singular: string, plural: string): string {
      return number === 1 ? singular.replace('{}', number.toString()) : plural.replace('{}', number.toString());
    }
  },
  watch: {
    'filter.fulfillmentStatus'() {
      this.fetchOrders();
    },
    'filter.dateRange'() {
      this.fetchOrders();
    }
  },
  mounted() {
    this.fetchOrders();
  }
});
</script>


<style scoped lang="scss">
.table {
  table-layout: fixed;
}

.img-thumbnail {
  height: 48px !important;
}

@media print {
  a {
    color: var(--bs-body-color) !important;
    text-decoration: none !important;
  }
}
</style>
