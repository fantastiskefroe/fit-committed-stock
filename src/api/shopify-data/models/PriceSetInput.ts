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
    MoneyInput,
} from './';

/**
 * @export
 * @interface PriceSetInput
 */
export interface PriceSetInput {
    /**
     * @type {MoneyInput}
     * @memberof PriceSetInput
     */
    shop_money: MoneyInput;
    /**
     * @type {MoneyInput}
     * @memberof PriceSetInput
     */
    presentment_money: MoneyInput;
}
