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
            Bestilt d. {{ new Date(Date.parse(order?.created_at ?? '')).toLocaleString() }}
          </p>
          <p>
            Ordren på <a :href="`https://fantastiske-fro.myshopify.com/admin/orders/${order?.shopify_id}`"
                         target="_blank" class="link-primary">Shopify</a>
          </p>
          <p>
            Betalingsstatus: {{ order?.financial_status }}
            <br>
            Klargøringsstatus: {{ order?.fulfillment_status }}
          </p>
          <ul class="list-group list-group-flush">
            <li v-for="orderLine in order?.line_items" v-bind:key="orderLine.sku"
                class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">
                  {{ orderLine.title }}
                </div>
                <span class="text-secondary">
                  {{ orderLine.sku }}
                </span>
              </div>
              <span class="badge text-bg-secondary">{{ orderLine.quantity }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { OrderOutput } from '@/api/shopify-data';


export default defineComponent({
  name: 'OrderView',
  props: {
    order: { type: Object as PropType<OrderOutput>, required: false }
  }
});
</script>

<style scoped>
</style>
