import {AuthMethodType} from '../../../shared/log-in/authMethods-type';

export class AuthMethodModel {
  authMethodType: AuthMethodType;
  location?: string;

  constructor(authMethodName: string, location?: string) {
    this.location = location;
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
