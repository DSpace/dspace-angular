import { AuthMethodType } from '../../../shared/log-in/methods/authMethods-type';
import { ShibbConstants } from '../../../+login-page/shibbolethTargetPage/const/shibbConstants';

export class AuthMethodModel {
  authMethodType: AuthMethodType;
  location?: string;
  isStandalonePage? = true;

  constructor(authMethodName: string, location?: string) {
    switch (authMethodName) {
      case 'ip': {
        this.authMethodType = AuthMethodType.Ip;
        break;
      }
      case 'ldap': {
        this.authMethodType = AuthMethodType.Ldap;
        break;
      }
      case 'shibboleth': {
        this.authMethodType = AuthMethodType.Shibboleth;
        const strings: string[] = location.split('target=');
        const target = strings[1];
        this.location = target + location + '/' + ShibbConstants.SHIBBOLETH_REDIRECT_ROUTE;
        break;
      }
      case 'x509': {
        this.authMethodType = AuthMethodType.X509;
        break;
      }
      case 'password': {
        this.authMethodType = AuthMethodType.Password;
        break;
      }

      default: {
        break;
      }
    }
  }
}
