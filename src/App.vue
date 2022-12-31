<template>
  <div class="container">
    <div class="row my-3">
      <h1 class="border border-3 border-end-0 w-auto mx-auto">SOLGT LAGER</h1>
    </div>
    <div class="row mb-3">
      <button class="col-1 offset-10 btn btn-primary" @click="refetch()">opdater</button>
    </div>
    
    <div class="row mb-3 justify-content-center">
      <table class="table table-borderless">
        <thead class="fw-bold border-bottom sticky-top bg-white">
          <tr>
            <td>Produkt titel</td>
            <td class="text-center border-start border-end">ANTAL</td>
            <td>ORDRER #</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredLines">
            <td>{{ item.sku }} | <span class="text-secondary">{{ item.title }}</span></td>
            <td class="text-center border-start border-end">{{ item.quantity }}</td>
            <td>{{ item.orderNumbers.join(", ") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div id="filterBar" class="sticky-bottom container bg-white py-3 border border-bottom-0 rounded-top">
    <div class="row">
      <div class="col input-group">
        <span class="input-group-text">Filter</span><input class="form-control" type="text" v-model="filter">
      </div>
      <div class="col text-end">
        <span>{{ filteredLines.length }} Produkter</span>  
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { OrdersApi } from '@/util/api';
import {FulfillmentStatus, type OrderLineDTO, type OrderDTO} from '@/api/shopify-data';

interface Line {
  sku: string;
  title: string;
  quantity: number;
  orderNumbers: string[];
}
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

export default {
  data() {
    return {
      lines: [] as Line[],
      filter: "^[^F]" as string
    }
  },
  computed: {
    filteredLines() : Line[] {
      if(this.filter.trim().length == 0) return this.lines;
      return this.lines.filter(l => RegExp(this.filter).test(l.sku))
    }
  },
  methods: {
    refetch() {
      OrdersApi
      .ordersGet({fulfillmentStatus: FulfillmentStatus.Null})
      .subscribe(orders => {
        this.lines = this.toLines(orders)
      })
    }
    ,
    toLines(orders: OrderDTO[]): Line[] {
      function fromDTO(order: OrderDTO, line: OrderLineDTO): OrderLine {
        return {
          sku: line.sku,
          title: line.title,
          quantity: line.quantity ?? 0,
          orderNumber: order.name
        }
      }

      function toLine(summary: OrderLineSummary): Line {
        summary.orderNumbers.sort()
        return summary
      }

      function groupBy<K,V>(l: V[], keyExtractor: (v: V) => K): Map<K,V[]> {
        return l.reduce((groups, value) => {
        const key = keyExtractor(value);
        let group = groups.get(key) ?? []
        group.push(value);
        groups.set(key, group);
        return groups;
        }, new Map())
      }

      const combineSummaries = (acc: OrderLineSummary, other: OrderLineSummary): OrderLineSummary => {
        acc.quantity += other.quantity
        acc.orderNumbers = acc.orderNumbers.concat(other.orderNumbers)
        return acc;
      }

      function toOrderLineSummary(line: OrderLine): OrderLineSummary {
        return {
          sku: line.sku,
          quantity: line.quantity,
          title: line.title,
          orderNumbers: Array.of(line.orderNumber)
        }
      }

      function summaryCompareSku(a: OrderLineSummary,b: OrderLineSummary) : number { 
        return a.sku.localeCompare(b.sku);
      }

      // Extract lines
      const orderLines = orders.flatMap(order => order.line_items.map( line => fromDTO(order, line)))
      // Group by sku
      const linesBySku = groupBy(orderLines, line => line.sku)
      // fold quantities
      const lineSummaries = Array.from(linesBySku.values())
        .flatMap(lines => 
          lines
            .map(toOrderLineSummary)
            .reduce(combineSummaries)
        )
      
      return lineSummaries.sort(summaryCompareSku).map(toLine)
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    this.refetch()
  }
}

</script>


<style scoped lang="scss">

</style>
