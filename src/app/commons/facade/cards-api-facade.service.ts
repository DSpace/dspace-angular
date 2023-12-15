import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { CardsApiService } from '../generated/services/cards-api.service';
import { Observable, mergeMap } from 'rxjs';
import { HttpContext, HttpEvent, HttpResponse } from '@angular/common/http';
import { CardResponse } from '../generated/interfaces/card-response';
import { Card } from '../generated/interfaces/card';
import { AddCardResponse } from '../generated/interfaces/add-card-response';
import { AddCardReq } from '../generated/interfaces/add-card-req';
import { ApiResponse } from '../generated/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class CardsApiFacadeService {

  constructor(private cardsApiService: CardsApiService,
    private configurationService: ConfigurationService,) { }
  /**
     * Get card List
     * Get card List.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
  public cardsGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<CardResponse>;
  public cardsGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<CardResponse>>;
  public cardsGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<CardResponse>>;
  public cardsGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
    return this.configurationService.getConfigurationValue('api-server')
    .pipe(
        mergeMap(configurationValue => {
            return this.cardsApiService.cardsGet(observe);
        }));
      
  }

  
    /**
     * Update Card
     * Update Card.
     * @param card 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public cardPut(card?: Card, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<AddCardResponse>;
    public cardPut(card?: Card, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<AddCardResponse>>;
    public cardPut(card?: Card, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<AddCardResponse>>;
    public cardPut(card?: Card, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
    .pipe(
        mergeMap(configurationValue => {
            return this.cardsApiService.cardPut(card);
        }));
      
    }

      /**
     * Add Card
     * Add Card.
     * @param addCardReq 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
      public cardPost(addCardReq?: AddCardReq, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<AddCardResponse>;
      public cardPost(addCardReq?: AddCardReq, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<AddCardResponse>>;
      public cardPost(addCardReq?: AddCardReq, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<AddCardResponse>>;
      public cardPost(addCardReq?: AddCardReq, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
        .pipe(
            mergeMap(configurationValue => {
                return this.cardsApiService.cardPost(addCardReq);
            }));
         
      }

       /**
     * Delete Card
     * Delete Card
     * @param id Card ID.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public cardIdDelete(id: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<ApiResponse>;
    public cardIdDelete(id: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<ApiResponse>>;
    public cardIdDelete(id: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<ApiResponse>>;
    public cardIdDelete(id: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.cardsApiService.cardIdDelete(id,observe,reportProgress);
          }));
    }

}
