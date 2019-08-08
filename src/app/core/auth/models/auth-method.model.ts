export class AuthMethodModel {
  authMethodName: string;
  location?: string;
  authMethodConstant: AuthMethodConstants

  constructor(authMethodName: string, location?: string) {
    this.authMethodName = authMethodName;
    this.location = location;
    switch (authMethodName) {
      case 'ip': {
        this.authMethodConstant = AuthMethodConstants.IP;
        break;
      }
      case 'ldap': {
        this.authMethodConstant = AuthMethodConstants.LDAP;
        break;
      }
      case 'shibboleth': {
        this.authMethodConstant = AuthMethodConstants.SHIBBOLETH;
        break;
      }
      case 'x509': {
        this.authMethodConstant = AuthMethodConstants.X509;
        break;
      }
      case 'password': {
        this.authMethodConstant = AuthMethodConstants.PASSWORD;
        break;
      }

      default: {
        break;
      }
    }
  }
}

export enum AuthMethodConstants {
  IP,
  LDAP,
  SHIBBOLETH,
  X509,
  PASSWORD,
}
