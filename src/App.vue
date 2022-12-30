<script lang="ts">
  import { OrderControllerApi, Configuration, FulfillmentStatus } from '@/api/shopify-data';

  const OrdersApi = new OrderControllerApi(
    new Configuration({
      basePath: "https://shopify-data.it.fantastiskefroe.dk"
    })
  )

  type Line = {
    message: String
  }

  export default {

    data() {
      return {
        lines: [] as Line[]
      }
    },
    methods: {
      refetch() {
        OrdersApi.ordersGet({fulfillmentStatus: FulfillmentStatus.Null }).subscribe(orders => {
          console.log("RXJS", orders)
          this.lines = orders.map( order => { return {message: order.name} } )
        })
      }
    },
    mounted() {
      // methods can be called in lifecycle hooks, or other methods!
      this.refetch()
    }
  }

</script>

<template>
  <div class="container">
    <div class="row my-5">
      <h1 class="display-4">Committed stock</h1>
      <button class="btn-primary" @click="refetch()"></button>
    </div>

    <div class="row mb-3 justify-content-center">
      <ul>
        <li v-for="item in lines">
          {{ item.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>
