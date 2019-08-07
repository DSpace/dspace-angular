export class AuthMethodModel {
  authMethodName: string;
  location?: string;
  authMethodConstant: AuthMethodConstants

  constructor(authMethodName: string, location?: string) {
    this.authMethodName = authMethodName;
    this.location = location;
    switch (authMethodName) {
      case 'password': {
        this.authMethodConstant = AuthMethodConstants.PASSWORD;
        break;
      }
      case 'shibboleth': {
        this.authMethodConstant = AuthMethodConstants.SHIBBOLETH;
        break;
      }
      case 'ldap': {
        this.authMethodConstant = AuthMethodConstants.LDAP;
        break;
      }
      default: {
        break;
      }
    }
  }
}

export enum AuthMethodConstants {
  PASSWORD,
  SHIBBOLETH,
  LDAP
}
