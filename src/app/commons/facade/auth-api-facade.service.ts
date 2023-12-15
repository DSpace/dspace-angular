import { Injectable } from '@angular/core';
import { HttpResponse, HttpEvent, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { mergeMap } from 'rxjs';
import { LoginReq } from '../generated/interfaces/login-req';
import { AuthApiService } from '../generated/services/auth-api.service';
import { UserResponse } from '../generated/interfaces/user-response';
import { RegisterUser } from '../generated/interfaces/register-user';
import { ApiResponse } from '../generated/interfaces/api-response';
import { ForgotPasswordReq } from '../generated/interfaces/forgot-password-req';
import { ResetPasswordReq } from '../generated/interfaces/reset-password-req';



@Injectable({
    providedIn: 'root'
})
export class AuthFacadeApiService {

    constructor(
        private configurationService: ConfigurationService,
        private authService: AuthService,
        private authApiService: AuthApiService
    ) { }


    /**
    * Login
    * Normal Login
    * @param loginReq 
    * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
    * @param reportProgress flag to report request and response progress.
    */
    public authLoginPost(loginReq?: LoginReq, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<UserResponse>;
    public authLoginPost(loginReq?: LoginReq, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<UserResponse>>;
    public authLoginPost(loginReq?: LoginReq, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<UserResponse>>;
    public authLoginPost(loginReq?: LoginReq, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
            .pipe(
                mergeMap(configurationValue => {
                    return this.authApiService.authLoginPost(loginReq, observe, reportProgress);
                }));

    }

    /**
    * Register user
    * Register new user
    * @param registerUser 
    * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
    * @param reportProgress flag to report request and response progress.
    */
    public authRegisterPost(registerUser?: RegisterUser, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
    public authRegisterPost(registerUser?: RegisterUser, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
    public authRegisterPost(registerUser?: RegisterUser, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
    public authRegisterPost(registerUser?: RegisterUser, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
            .pipe(
                mergeMap(configurationValue => {
                    return this.authApiService.authRegisterPost(registerUser, observe, reportProgress);
                }));

    }

    /**
     * Verify User
     * Verfiy user on open verfication link.
     * @param verificationCode Verification code.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public authVerifyUserVerificationCodeGet(verificationCode: string, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
    public authVerifyUserVerificationCodeGet(verificationCode: string, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
    public authVerifyUserVerificationCodeGet(verificationCode: string, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
    public authVerifyUserVerificationCodeGet(verificationCode: string, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
            .pipe(
                mergeMap(configurationValue => {
                    return this.authApiService.authVerifyUserVerificationCodeGet(verificationCode, observe, reportProgress);
                }));
    }
    /**
        * Forgot Password
        * Send Forgot Password link
        * @param forgotPasswordReq 
        * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
        * @param reportProgress flag to report request and response progress.
        */
    public authForgotPasswordPost(forgotPasswordReq?: ForgotPasswordReq, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
    public authForgotPasswordPost(forgotPasswordReq?: ForgotPasswordReq, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
    public authForgotPasswordPost(forgotPasswordReq?: ForgotPasswordReq, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
    public authForgotPasswordPost(forgotPasswordReq?: ForgotPasswordReq, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
            .pipe(
                mergeMap(configurationValue => {
                    return this.authApiService.authForgotPasswordPost(forgotPasswordReq, observe, reportProgress);
                }));

    }


    /**
     * Reset Password
     * Reset Password
     * @param resetPasswordReq 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public authResetPasswordPost(resetPasswordReq?: ResetPasswordReq, observe?: 'body', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<ApiResponse>;
    public authResetPasswordPost(resetPasswordReq?: ResetPasswordReq, observe?: 'response', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpResponse<ApiResponse>>;
    public authResetPasswordPost(resetPasswordReq?: ResetPasswordReq, observe?: 'events', reportProgress?: boolean, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<HttpEvent<ApiResponse>>;
    public authResetPasswordPost(resetPasswordReq?: ResetPasswordReq, observe: any = 'body', reportProgress: boolean = false, options?: { httpHeaderAccept?: 'application/json', context?: HttpContext }): Observable<any> {
        return this.configurationService.getConfigurationValue('api-server')
            .pipe(
                mergeMap(configurationValue => {
                    return this.authApiService.authResetPasswordPost(resetPasswordReq, observe, reportProgress);
                }));

    }


}
