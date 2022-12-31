import { Configuration, OrderControllerApi } from '@/api/shopify-data';

const config = new Configuration({
    basePath: 'https://shopify-data.it.fantastiskefroe.dk'
  }
);

export const OrdersApi = new OrderControllerApi(config);
