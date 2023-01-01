<template>
  <OrderModal :order="selectedOrder"></OrderModal>

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
            <a href="#" v-for="order in summary.orders" v-bind:key="order.number" @click="selectedOrder = order"
                  data-bs-toggle="modal" data-bs-target="#orderModal" class="me-1">
              {{ order.name }}
            </a>
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
      filter: '^[^F]' as string,
      products: [] as Product[]
    };
  },
  computed: {
    filteredOrderLineSummaries(): OrderLineSummary[] {
      if (this.filter.trim().length == 0) return this.orderLineSummaries;
      try {
        const filterRegex = RegExp(this.filter, 'i');
        return this.orderLineSummaries.filter(l => filterRegex.test(l.sku));
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
          this.orderLineSummaries = this.toOrderLineSummaries(orders);
        });
    },
    getImageBySku(sku: string): string {
      return this.products
        .find(p => p.variants.some(v => v.sku == sku))?.imgUrl ??
          "https://cdn.shopify.com/s/files/1/0276/3902/1652/files/FantastiskeFroe_logo_mini_32x32.png?v=1583103209";
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
  mounted() {
    this.fetchOrders();
  }
});
</script>


<style scoped lang="scss">

</style>
