<template>
  <div class="container">
    <div class="row my-3">
      <h1 class="display-4">Solgt Lager</h1>
    </div>

    <div class="row mb-3 justify-content-center">
      <table class="table table-borderless">
        <thead class="fw-bold border-bottom sticky-top bg-white">
        <tr>
          <th class="d-print-none"></th>
          <th class="border-end">Titel</th>
          <th class="border-end">SKU</th>
          <th class="text-center border-end">Antal</th>
          <th>Ordrer</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="summary in filteredOrderLineSummaries" v-bind:key="summary.sku" class="align-middle">
          <td class="text-end py-0 d-print-none">
            <img :src=getImageBySku(summary.sku) loading="lazy" height="32" class="rounded"
                 :alt="summary.title">
          </td>
          <td class="border-end">
            {{ summary.title }}
          </td>
          <td class="border-end">
            <span class="text-secondary">{{ summary.sku }}</span>
          </td>
          <td class="border-end text-center">
            {{ summary.quantity }}
          </td>
          <td>
            <span v-for="orderName in summary.orderNames" v-bind:key="orderName">
                <OrderView :order="orders[orderName]"></OrderView>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="sticky-bottom container bg-white py-3 border border-bottom-0 rounded-top d-print-none">
    <div class="row">
      <div class="col input-group">
        <span class="input-group-text">Filter</span><input class="form-control" type="text" v-model="filter">
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
import OrderView from '@/components/OrderView.vue';

interface OrderLine {
  sku: string;
  title: string;
  quantity: number;
  orderName: string;
}

interface OrderLineSummary {
  sku: string;
  title: string;
  quantity: number;
  orderNames: string[];
}

export default defineComponent({
  components: { OrderView },
  data() {
    return {
      orders: {} as Record<string, OrderDTO>,
      lines: [] as OrderLineSummary[],
      filter: '^[^F]' as string,
      products: [] as Product[]
    };
  },
  computed: {
    filteredOrderLineSummaries(): OrderLineSummary[] {
      if (this.filter.trim().length == 0) return this.lines;
      try {
        const filterRegex = RegExp(this.filter, 'i');
        return this.lines.filter(l => filterRegex.test(l.sku));
      } catch {
        return [];
      }
    }
  },
  methods: {
    fetchOrders(): void {
      ProductsService.getAll().then(products => {
        this.products = products;
      });
      OrdersApi.ordersGet({ fulfillmentStatus: FulfillmentStatus.Null })
        .subscribe((orders: OrderDTO[]) => {
          orders.forEach((order) => this.orders[order.name] = order);
          this.lines = this.toOrderLineSummaries(orders);
        });
    },
    getImageBySku(sku: string): string {
      return this.products.find(p => p.variants.find(v => v.sku == sku) != undefined)?.imgUrl ??
          "https://cdn.shopify.com/s/files/1/0276/3902/1652/files/FantastiskeFroe_logo_mini_32x32.png?v=1583103209";
    },
    toOrderLineSummaries(orders: OrderDTO[]): OrderLineSummary[] {
      // Extract lines
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
          orderName: order.name
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
          orderNames: [orderLine.orderName]
        };
      }

      function combineSummaries(acc: OrderLineSummary, other: OrderLineSummary): OrderLineSummary {
        return {
          sku: acc.sku,
          title: acc.title,
          quantity: acc.quantity + other.quantity,
          orderNames: acc.orderNames.concat(other.orderNames).sort()
        };
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
});
</script>


<style scoped lang="scss">

</style>
