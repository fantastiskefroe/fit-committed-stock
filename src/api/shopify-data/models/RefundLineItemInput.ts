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
    RestockTypeInput,
} from './';

/**
 * @export
 * @interface RefundLineItemInput
 */
export interface RefundLineItemInput {
    /**
     * @type {number}
     * @memberof RefundLineItemInput
     */
    line_item_id: number;
    /**
     * @type {RestockTypeInput}
     * @memberof RefundLineItemInput
     */
    restock_type: RestockTypeInput;
}
