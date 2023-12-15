import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { NotificationsApiService } from '../generated/services/notifications-api.service';
import { Observable, mergeMap } from 'rxjs';
import { HttpContext, HttpEvent, HttpResponse } from '@angular/common/http';
import { NotificationsResponse } from '../generated/interfaces/notifications-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiFacadeService {

  constructor(private configurationService: ConfigurationService,
    private NotificationsApiService: NotificationsApiService) { }

    /**
     * Get all notifications
     * Get all notifications
     * @param pageNumber Page Number
     * @param noOfRecordsPerPage No of Records per page
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public notificationsGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<NotificationsResponse>;
    public notificationsGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<NotificationsResponse>>;
    public notificationsGet(pageNumber: number, noOfRecordsPerPage: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<NotificationsResponse>>;
    public notificationsGet(pageNumber: number, noOfRecordsPerPage: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
     return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.NotificationsApiService.notificationsGet(pageNumber,noOfRecordsPerPage,observe,reportProgress);
          }));
       
    }
}
