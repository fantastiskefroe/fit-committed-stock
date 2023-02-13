// tslint:disable
/**
 * fit-shopify-data API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    CancelReasonInput,
    CustomerInput,
    FinancialStatusInput,
    FulfillmentStatusInput,
    OrderLineInput,
    PriceSetInput,
    RefundInput,
} from './';

/**
 * @export
 * @interface OrderInput
 */
export interface OrderInput {
    /**
     * @type {number}
     * @memberof OrderInput
     */
    id: number;
    /**
     * @type {number}
     * @memberof OrderInput
     */
    number: number;
    /**
     * @type {string}
     * @memberof OrderInput
     */
    name: string;
    /**
     * @type {CustomerInput}
     * @memberof OrderInput
     */
    customer: CustomerInput;
    /**
     * @type {CancelReasonInput}
     * @memberof OrderInput
     */
    cancel_reason?: CancelReasonInput | null;
    /**
     * @type {FinancialStatusInput}
     * @memberof OrderInput
     */
    financial_status?: FinancialStatusInput | null;
    /**
     * @type {FulfillmentStatusInput}
     * @memberof OrderInput
     */
    fulfillment_status?: FulfillmentStatusInput | null;
    /**
     * @type {PriceSetInput}
     * @memberof OrderInput
     */
    current_total_discounts_set: PriceSetInput;
    /**
     * @type {PriceSetInput}
     * @memberof OrderInput
     */
    current_subtotal_price_set: PriceSetInput;
    /**
     * @type {PriceSetInput}
     * @memberof OrderInput
     */
    current_total_tax_set: PriceSetInput;
    /**
     * @type {PriceSetInput}
     * @memberof OrderInput
     */
    total_shipping_price_set: PriceSetInput;
    /**
     * @type {PriceSetInput}
     * @memberof OrderInput
     */
    current_total_price_set: PriceSetInput;
    /**
     * @type {number}
     * @memberof OrderInput
     */
    total_weight: number;
    /**
     * @type {string}
     * @memberof OrderInput
     */
    created_at: string;
    /**
     * @type {Array<OrderLineInput>}
     * @memberof OrderInput
     */
    line_items: Array<OrderLineInput>;
    /**
     * @type {Array<RefundInput>}
     * @memberof OrderInput
     */
    refunds: Array<RefundInput>;
}