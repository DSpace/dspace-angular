import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { GlobalConstants } from '../../classes/global-constants';
import { LoadingService } from '../loading/loading.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _idToken: any;
  public _UserLoginId: any;
  private _accessToken: any;
  private _roleType:any;
  private _user$: BehaviorSubject<any> = new BehaviorSubject(null);
  public requireAuthentication = true;
  private tokenLoaded = false;
  public _IsStoreUpdated = false;
  locationOrigin: string;
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public notifyLogin$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(public router: Router,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    // private loginFacadeApiService: LoginFacadeApiService,
    ) {
    this.locationOrigin = window.location.origin;
    this._idToken = localStorage.getItem(GlobalConstants.ID_TOKEN_KEY) || '';
    // this._UserLoginId = localStorage.getItem(GlobalConstants.UserLoginId) || '';
    this._accessToken = localStorage.getItem(GlobalConstants.ACCESS_TOKEN_KEY) || '';
    // this._roleType = localStorage.getItem(GlobalConstants.ROLE_TYPE) || '';
    const userItem = localStorage.getItem(GlobalConstants.USER_KEY);
    if (userItem) {
      this._user$.next(JSON.parse(userItem));
    }
    this.getNewToken();
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  get UserLoginId(): string {
    return this._UserLoginId;
  }

  get RoleType(): string {
    return this._roleType;
  }

  get user(): Observable<any> {
    return this._user$.asObservable().pipe(filter(user => user !== null));
  }

  public renewTokens(): void {
    console.log('Scheduling session checks');
    setInterval(() => {
      this.getNewToken();
    }, 900000);
  }
  

  private getNewToken() {
    console.log('Check user is authenticated');
    if (this.isAuthenticated()) {
      console.log('Checking session of user');
      this.tokenLoaded = false;
      // this.loginFacadeApiService.apiAuthGenerateRefreshTokenPost(this._accessToken).subscribe({
      //   next: (res)  => {
      //     if(res.success){
      //       this.localLogin(res.result);
      //       this._accessToken
      //       localStorage.setItem(GlobalConstants.ACCESS_TOKEN_KEY, this._accessToken);
      //       localStorage.setItem(GlobalConstants.ID_TOKEN_KEY, this._idToken);
      //     }else{
      //       console.error(res.message);
      //     }
      //   },
      //   error : (err) => {
      //     console.error(`Could not get a new token`, err);
      //   },
      // });
    } else {
      console.log('Skipping session check user is not logged in');
    }
  }

  public localLogin(authResult : any): void {
    // Set the time that the access token will expire at
    this._accessToken = authResult.refreshToken;
    this._idToken = authResult.token;
    this._UserLoginId = authResult.nUserId;
    this._roleType = authResult.cRoleType;
    this.tokenLoaded = true;
    const user: any = {
      cCompanyName : authResult.cCompanyName,
      cStoreName: authResult.cStoreName,
      cEmpName: authResult.cEmpName,
      companyLogo: authResult.companyLogo,
      nUserId: authResult.nUserId,
      nLoginId: authResult.nLoginId,
    };
    localStorage.setItem(GlobalConstants.ACCESS_TOKEN_KEY, this._accessToken);
    localStorage.setItem(GlobalConstants.ID_TOKEN_KEY, this._idToken);
    // localStorage.setItem(GlobalConstants.UserLoginId, this._UserLoginId);
    localStorage.setItem(GlobalConstants.USER_KEY, JSON.stringify(user));
    // localStorage.setItem(GlobalConstants.ROLE_TYPE, this.RoleType);
    if (!this._user$.value || this._user$.value.nLoginId !== user.nLoginId) {
      this._user$.next(user);
    }
  }

  public isAuthenticated(): boolean {
    return !!this._accessToken;
  }

  public logout(): void {

    this._accessToken = '';
    this._idToken = '';
    this._UserLoginId = '';
    this.tokenLoaded = false;
    localStorage.setItem(GlobalConstants.ACCESS_TOKEN_KEY, '');
    localStorage.setItem(GlobalConstants.ID_TOKEN_KEY, '');
    localStorage.setItem(GlobalConstants.USER_KEY, '');
    localStorage.setItem('loginavaliable','');
    localStorage.setItem('bearerAuth','');
    localStorage.setItem('userFirstName','');
    localStorage.setItem('userEmail','');
    localStorage.setItem('userLastName','');
    localStorage.setItem('user_id','');
   
    // localStorage.setItem(GlobalConstants.UserLoginId, '');
    // localStorage.setItem(GlobalConstants.ROLE_TYPE,'');
    this.dialog.closeAll();
    this.notifyLogin();
    // this.router.navigate(['login'])
    // .then(() => {
    //   window.location.reload();
    // });
  }

  notifyLogin() {
    this.isAuthenticatedSubject.next(true);
    return true;
  }

}
