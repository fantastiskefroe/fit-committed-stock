<template>
  <div class="modal" id="orderModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Ordre {{ order?.name }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>
            Bestilt d. {{ new Date(Date.parse(order?.created_at ?? "")).toLocaleString() }}
          </p>
          <p>
            Ordre på <a :href="`https://fantastiske-fro.myshopify.com/admin/orders/${order?.shopify_id}`">Shopify</a>
          </p>
          <p>
            Betalingsstatus: {{ order?.financial_status }}
            Klargøringsstatus: {{ order?.fulfillment_status }}
          </p>
          <p>
            Ordrelinjer:
          </p>
          <ul>
            <li v-for="orderLine in order?.line_items" v-bind:key="orderLine.sku">
              {{ orderLine.title }} x {{ orderLine.quantity }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { OrderDTO } from '@/api/shopify-data';


export default defineComponent({
  name: 'OrderView',
  props: {
    order: { type: Object as PropType<OrderDTO>, required: false }
  }
});
</script>

<style scoped>
</style>
