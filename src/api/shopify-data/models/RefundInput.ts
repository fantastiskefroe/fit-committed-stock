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
    RefundLineItemInput,
} from './';

/**
 * @export
 * @interface RefundInput
 */
export interface RefundInput {
    /**
     * @type {Array<RefundLineItemInput>}
     * @memberof RefundInput
     */
    refund_line_items: Array<RefundLineItemInput>;
}
