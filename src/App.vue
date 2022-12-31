<template>
  <div class="container">
    <div class="row my-3">
      <h1>Solgt Lager</h1>
    </div>

    <div class="row mb-3 justify-content-center">
      <table class="table table-borderless">
        <thead class="fw-bold border-bottom sticky-top bg-white">
        <tr>
          <th>Titel</th>
          <th>SKU</th>
          <th class="text-center border-start border-end">Antal</th>
          <th>Ordrer</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in filteredLines" v-bind:key="item.sku">
          <td>{{ item.title }}</td>
          <td><span class="text-secondary">{{ item.sku }}</span></td>
          <td class="text-center border-start border-end">{{ item.quantity }}</td>
          <td>{{ item.orderNumbers.join(', ') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="sticky-bottom container bg-white py-3 border border-bottom-0 rounded-top">
    <div class="row">
      <div class="col input-group">
        <span class="input-group-text">Filter</span><input class="form-control" type="text" v-model="filter">
      </div>
      <div class="col text-end">
        <span>{{ filteredLines.length }} produkter</span>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { OrdersApi } from '@/util/api';
import { FulfillmentStatus, type OrderDTO, type OrderLineDTO } from '@/api/shopify-data';
import { defineComponent } from 'vue';

interface OrderLine {
  sku: string;
  title: string;
  quantity: number;
  orderNumber: string;
}

interface OrderLineSummary {
  sku: string;
  title: string;
  quantity: number;
  orderNumbers: string[];
}

export default defineComponent({
  data() {
    return {
      lines: [] as OrderLineSummary[],
      filter: '^[^F]' as string
    };
  },
  computed: {
    filteredLines(): OrderLineSummary[] {
      if (this.filter.trim().length == 0) return this.lines;
      try {
        const filterRegex = RegExp(this.filter, 'i');
        console.log(filterRegex);
        return this.lines.filter(l => filterRegex.test(l.sku));
      } catch {
        return [];
      }
    }
  },
  methods: {
    fetchOrders(): void {
      OrdersApi.ordersGet({ fulfillmentStatus: FulfillmentStatus.Null })
        .subscribe((orders: OrderDTO[]) => {
          this.lines = this.toOrderLineSummaries(orders);
        });
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
        .sort(summaryCompareSku);

      function orderLineFromDTO(order: OrderDTO, line: OrderLineDTO): OrderLine {
        return {
          sku: line.sku,
          title: line.title,
          quantity: line.quantity ?? 0,
          orderNumber: order.name
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
          orderNumbers: [orderLine.orderNumber]
        };
      }

      function combineSummaries(acc: OrderLineSummary, other: OrderLineSummary): OrderLineSummary {
        return {
          sku: acc.sku,
          title: acc.title,
          quantity: acc.quantity + other.quantity,
          orderNumbers: acc.orderNumbers.concat(other.orderNumbers).sort()
        };
      }

      function summaryCompareSku(a: OrderLineSummary, b: OrderLineSummary): number {
        return a.sku.localeCompare(b.sku);
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
