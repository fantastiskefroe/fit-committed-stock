<template>
  <span class="me-1">
    <a :href="`https://fantastiske-fro.myshopify.com/admin/orders/${order.shopify_id}`" target="_blank">
      {{ order.name }}</a>
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { OrderDTO } from '@/api/shopify-data';


export default defineComponent({
  name: 'OrderView',
  props: {
    order: { type: Object as PropType<OrderDTO>, required: true }
  }
});
</script>

<style scoped>
</style>
