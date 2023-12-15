import { Injectable } from '@angular/core';
import { TripRequest } from '../generated/interfaces/trip-request';
import { HttpContext, HttpEvent, HttpResponse } from '@angular/common/http';
import { ItineraryResponse } from '../generated/interfaces/itinerary-response';
import { Observable, mergeMap } from 'rxjs';
import { TripsApiService } from '../generated/services/trips-api.service';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { TripData } from '../generated/interfaces/trip-data';
import { SaveTripResponse } from '../generated/interfaces/save-trip-response';
import { ListTripsResponse } from '../generated/interfaces/list-trips-response';
import { ApiResponse } from '../generated/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class TripsFacadeApiService {

  constructor(private configurationService: ConfigurationService,
    private tripsApiService: TripsApiService) { }

  /**
    * Trip Search
    * Trip search
    * @param tripRequest 
    * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
    * @param reportProgress flag to report request and response progress.
    */
  public tripSearchPost(tripRequest?: TripRequest, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ItineraryResponse>;
  public tripSearchPost(tripRequest?: TripRequest, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ItineraryResponse>>;
  public tripSearchPost(tripRequest?: TripRequest, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ItineraryResponse>>;
  public tripSearchPost(tripRequest?: TripRequest, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripSearchPost(tripRequest, observe, reportProgress);
        }));
  }

  /**
    * Save Trip
    * Save Trip - For request body don\&#39;t pass [id, is_active, book_by_tripson, updated_on, created_on]
    * @param tripData 
    * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
    * @param reportProgress flag to report request and response progress.
    */
  public tripPost(tripData?: TripData, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<SaveTripResponse>;
  public tripPost(tripData?: TripData, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<SaveTripResponse>>;
  public tripPost(tripData?: TripData, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<SaveTripResponse>>;
  public tripPost(tripData?: TripData, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripPost(tripData, observe, reportProgress);
        }));
  }

  /**
    * get Public Trips
    * Get all public trips
 /**
 * get my trips
 * Get all my trips
 * @param pageNumber Page Number
 * @param noOfRecordsPerPage No of Records per page
 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
 * @param reportProgress flag to report request and response progress.
 */
  public tripsSelfGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ListTripsResponse>;
  public tripsSelfGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ListTripsResponse>>;
  public tripsSelfGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ListTripsResponse>>;
  public tripsSelfGet(pageNumber: number, noOfRecordsPerPage: number, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripsSelfGet(pageNumber, noOfRecordsPerPage, observe, reportProgress);
        }));
  }

  /**
     * get my favorite trips
     * Get all my favorite trips
     * @param pageNumber Page Number
     * @param noOfRecordsPerPage No of Records per page
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
  public tripsPublicGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ListTripsResponse>;
  public tripsPublicGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ListTripsResponse>>;
  public tripsPublicGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ListTripsResponse>>;
  public tripsPublicGet(pageNumber: number, noOfRecordsPerPage: number, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripsPublicGet(pageNumber, noOfRecordsPerPage);
        }));
  }

  public tripsFavoriteGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ListTripsResponse>;
  public tripsFavoriteGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ListTripsResponse>>;
  public tripsFavoriteGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ListTripsResponse>>;
  public tripsFavoriteGet(pageNumber: number, noOfRecordsPerPage: number, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripsFavoriteGet(pageNumber, noOfRecordsPerPage, observe, reportProgress);
        }));
  }

  /**
      * Favorite Unfavorite trip
      * Favorite Unfavorite trip
      * @param tripId Trip ID.
      * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
      * @param reportProgress flag to report request and response progress.
      */
  public tripsFavoriteTripIdPost(tripId: string, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
  public tripsFavoriteTripIdPost(tripId: string, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
  public tripsFavoriteTripIdPost(tripId: string, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
  public tripsFavoriteTripIdPost(tripId: string, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripsFavoriteTripIdPost(tripId, observe, reportProgress);
        }));
  }

  /**
   * Join trip request
   * Join trip request
   * @param tripId Trip ID.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public tripsJoinTripIdPost(tripId: string, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
  public tripsJoinTripIdPost(tripId: string, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
  public tripsJoinTripIdPost(tripId: string, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
  public tripsJoinTripIdPost(tripId: string, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
      .pipe(
        mergeMap(configurationValue => {
          return this.tripsApiService.tripsJoinTripIdPost(tripId, observe, reportProgress);
        }));
  }

   /**
     * Trip Detail
     * get trip detail
     * @param tripId Trip ID.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
   public tripTripIdGet(tripId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<SaveTripResponse>;
   public tripTripIdGet(tripId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<SaveTripResponse>>;
   public tripTripIdGet(tripId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<SaveTripResponse>>;
   public tripTripIdGet(tripId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
    .pipe(
      mergeMap(configurationValue => {
        return this.tripsApiService.tripTripIdGet(tripId, observe, reportProgress);
      }));
   }

}
