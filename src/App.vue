<template>
  <OrderModal :order="selectedOrder"></OrderModal>

  <div class="container">
    <div class="row my-3">
      <h1 class="display-4">Solgt Lager</h1>
    </div>

    <div class="row mb-5">
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
        <tr v-for="summary in filteredOrderLineSummaries" v-bind:key="summary.sku" class="align-middle">
          <td class="text-center d-print-none">
            <img :src=getImageBySku(summary.sku) loading="lazy" class="img-thumbnail"
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
            <a href="#" v-for="order in summary.orders" v-bind:key="order.number" @click="selectedOrder = order"
               data-bs-toggle="modal" data-bs-target="#orderModal" class="link-primary me-1">
              {{ order.name }}
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="fixed-bottom container bg-white py-3 border border-bottom-0 rounded-top d-print-none">
    <div class="row">
      <div class="col input-group d-none">
        <span class="input-group-text">SKU filter</span>
        <input class="form-control" type="text" v-model="filter.skuRegex">
      </div>
      <div class="col input-group d-none">
        <span class="input-group-text">Status</span>
        <select class="form-select form-control" v-model="filter.fulfillmentType">
          <option v-for="statusType in Object.values(FulfillmentStatus)"
                  v-bind:key="statusType" :value="statusType">
            {{ statusType }}
          </option>
        </select>
      </div>
      <div class="col input-group">
        <span class="input-group-text">Tag</span>
        <select class="form-select form-control" v-model="filter.tag">
          <option value="">Ingen filter</option>
          <option v-for="tag in tags" v-bind:key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
      <div class="col text-end">
        <span>{{ filteredOrderLineSummaries.length }} produkter</span>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { OrdersApi } from '@/util/api';
import { FulfillmentStatus, type OrderDTO, type OrderLineDTO } from '@/api/shopify-data';
import { defineComponent } from 'vue';
import type { Product } from '@/types/product';
import ProductsService from '@/util/products-service';
import OrderModal from '@/components/OrderModal.vue';

interface OrderLine {
  sku: string;
  title: string;
  quantity: number;
  order: OrderDTO;
}

interface OrderLineSummary {
  sku: string;
  title: string;
  quantity: number;
  orders: OrderDTO[];
}

export default defineComponent({
  components: { OrderModal },
  data() {
    return {
      orderLineSummaries: [] as OrderLineSummary[],
      selectedOrder: undefined as OrderDTO | undefined,
      tags: [] as string[],
      filter: {
        skuRegex: '',
        fulfillmentType: FulfillmentStatus.Null,
        tag: 'stalden'
      },
      products: [] as Product[]
    };
  },
  computed: {
    FulfillmentStatus() {
      return FulfillmentStatus;
    },
    filteredOrderLineSummaries(): OrderLineSummary[] {
      function filterSku(filter: string): (summaries: OrderLineSummary[]) => OrderLineSummary[] {
        return (summaries: OrderLineSummary[]) => {
          if (filter.trim().length == 0) return summaries;
          try {
            const filterRegex = RegExp(filter, 'i');
            return summaries.filter(s => filterRegex.test(s.sku));
          } catch {
            return [];
          }
        };
      }

      function filterTag(tag: string, products: Product[]): (summaries: OrderLineSummary[]) => OrderLineSummary[] {
        return (summaries: OrderLineSummary[]) => {
          if (!tag) return summaries;
          return summaries.filter(s => {
            const product = products.find(p => p.variants.findIndex(v => v.sku === s.sku) !== -1);
            if (product === undefined) return false;
            return product.tags.indexOf(tag) !== -1;
          });
        };
      }

      const filters = [
        filterSku(this.filter.skuRegex),
        filterTag(this.filter.tag, this.products)
      ];

      return filters.reduce((lines, f) => f(lines), this.orderLineSummaries);

    }
  },
  methods: {
    fetchOrders(): void {
      ProductsService.getAll().then(products => {
        this.products = products;
        this.tags = Array.from(new Set(products.flatMap(p => p.tags))).sort();
      });
      OrdersApi.ordersGet({ fulfillmentStatus: this.filter.fulfillmentType })
        .subscribe((orders: OrderDTO[]) => {
          this.orderLineSummaries = this.toOrderLineSummaries(orders);
        });
    },
    getImageBySku(sku: string): string {
      return this.products
          .find(p => p.variants.some(v => v.sku == sku))?.imgUrl ??
        'https://cdn.shopify.com/s/files/1/0276/3902/1652/files/FantastiskeFroe_logo_mini_32x32.png?v=1583103209';
    },
    toOrderLineSummaries(orders: OrderDTO[]): OrderLineSummary[] {
      // Extract order lines
      const orderLines: OrderLine[] = orders
        .flatMap((order: OrderDTO) => order.line_items
          .map((line: OrderLineDTO) => orderLineFromDTO(order, line)));

      // Group by sku
      const orderLinesBySku = groupBy(orderLines, line => line.sku);

      // Combine to OrderLineSummaries
      return Array.from(orderLinesBySku.values())
        .flatMap((orderLines) =>
          orderLines
            .map(toOrderLineSummary)
            .reduce(combineSummaries)
        )
        .sort((a, b) => a.title.localeCompare(b.title));

      function orderLineFromDTO(order: OrderDTO, line: OrderLineDTO): OrderLine {
        return {
          sku: line.sku,
          title: line.title,
          quantity: line.quantity ?? 0,
          order: order
        };
      }

      function groupBy<K, V>(list: V[], keyExtractor: (v: V) => K): Map<K, V[]> {
        return list.reduce((groups: Map<K, V[]>, value: V) => {
          const key = keyExtractor(value);
          const group = groups.get(key) ?? [];
          group.push(value);
          groups.set(key, group);
          return groups;
        }, new Map());
      }

      function toOrderLineSummary(orderLine: OrderLine): OrderLineSummary {
        return {
          sku: orderLine.sku,
          quantity: orderLine.quantity,
          title: orderLine.title,
          orders: [orderLine.order]
        };
      }

      function combineSummaries(acc: OrderLineSummary, other: OrderLineSummary): OrderLineSummary {
        return {
          sku: acc.sku,
          title: acc.title,
          quantity: acc.quantity + other.quantity,
          orders: acc.orders.concat(other.orders).sort((a, b) => a.name.localeCompare(b.name))
        };
      }
    }
  },
  watch: {
    'filter.fulfillmentType'(newVal: FulfillmentStatus) {
      this.fetchOrders();
    }
  },
  mounted() {
    this.fetchOrders();
  }
});
</script>


<style scoped lang="scss">
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
