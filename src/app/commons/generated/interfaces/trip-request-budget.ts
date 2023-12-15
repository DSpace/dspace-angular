/**
 * Tripson -  1.0
 * Tripson api.
 *
 * The version of the OpenAPI document: 1.0.11
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TripRequestBudget { 
    /**
     * Overall budget for the trip
     */
    overall?: string;
    /**
     * Budget for hotels
     */
    hotel?: string;
    /**
     * Budget for flights
     */
    flight?: string;
    /**
     * Budget for tickets
     */
    ticket?: string;
}

