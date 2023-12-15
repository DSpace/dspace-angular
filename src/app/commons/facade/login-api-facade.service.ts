import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse, HttpEvent, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

// @ts-ignore
import { AuthResultSingleResponse } from '../interfaces/auth-result-single-response';
// @ts-ignore
import { CheckValidSingleResponse } from '../interfaces/check-valid-single-response';
// @ts-ignore
import { CheckValidTokenRequest } from '../interfaces/check-valid-token-request';
// @ts-ignore
import { GenerateTokenRequest } from '../interfaces/generate-token-request';
// @ts-ignore
import { LoginDetailListSingleResponse } from '../interfaces/login-detail-list-single-response';
import { AuthService } from '../services/auth/auth.service';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { mergeMap } from 'rxjs';
import { AuthApiService } from '../generated/services/auth-api.service';
import { LoginReq } from '../generated/interfaces/login-req';
import { UserResponse } from '../generated/interfaces/user-response';



@Injectable({
  providedIn: 'root'
})
export class LoginFacadeApiService {

    constructor(
        private configurationService: ConfigurationService,
        private authService: AuthService,
        private authApiService: AuthApiService 
    ) {}


     /**
     * Login
     * Normal Login
     * @param loginReq 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
     public authLoginPost(loginReq?: LoginReq, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<UserResponse>;
     public authLoginPost(loginReq?: LoginReq, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<UserResponse>>;
     public authLoginPost(loginReq?: LoginReq, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<UserResponse>>;
     public authLoginPost(loginReq?: LoginReq, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
        .pipe(
            mergeMap(configurationValue => {
            return this.authApiService.authLoginPost(loginReq, observe, reportProgress);
        }));
     }

}
