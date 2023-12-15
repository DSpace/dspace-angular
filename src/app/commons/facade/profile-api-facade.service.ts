import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { ProfileApiService } from '../generated/services/profile-api.service';
import { HttpContext, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, mergeMap } from 'rxjs';
import { User } from '../generated/interfaces/user';
import { EditProfileReq } from '../generated/interfaces/edit-profile-req';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiFacadeService {

  constructor(private configurationService: ConfigurationService,
    private profileAPIService: ProfileApiService) { }

    /**
     * Get user profile
     * Get crrunt user profile.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public profileGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<User>;
    public profileGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<User>>;
    public profileGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<User>>;
    public profileGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.profileAPIService.profileGet(observe,reportProgress);
          }));
       
    }

     /**
     * Edit profile
     * Edit user profile.
     * @param editProfileReq 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
     public profilePatch(editProfileReq?: EditProfileReq, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<User>;
     public profilePatch(editProfileReq?: EditProfileReq, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<User>>;
     public profilePatch(editProfileReq?: EditProfileReq, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<User>>;
     public profilePatch(editProfileReq?: EditProfileReq, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.profileAPIService.profilePatch(editProfileReq);
          }));
       
     }
}
