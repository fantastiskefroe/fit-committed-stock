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
    CancelReasonOutput,
    FinancialStatusOutput,
    FulfillmentStatusOutput,
    OrderLineOutput,
} from './';

/**
 * @export
 * @interface OrderOutput
 */
export interface OrderOutput {
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    shopify_id: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    number: number;
    /**
     * @type {string}
     * @memberof OrderOutput
     */
    name: string;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    customer_id?: number | null;
    /**
     * @type {CancelReasonOutput}
     * @memberof OrderOutput
     */
    cancel_reason: CancelReasonOutput;
    /**
     * @type {FinancialStatusOutput}
     * @memberof OrderOutput
     */
    financial_status: FinancialStatusOutput;
    /**
     * @type {FulfillmentStatusOutput}
     * @memberof OrderOutput
     */
    fulfillment_status: FulfillmentStatusOutput;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    subtotal_price: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    total_discount: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    total_tax: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    total_shipping_price: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    total_price: number;
    /**
     * @type {number}
     * @memberof OrderOutput
     */
    weight?: number | null;
    /**
     * @type {string}
     * @memberof OrderOutput
     */
    created_at: string;
    /**
     * @type {Array<OrderLineOutput>}
     * @memberof OrderOutput
     */
    line_items: Array<OrderLineOutput>;
}