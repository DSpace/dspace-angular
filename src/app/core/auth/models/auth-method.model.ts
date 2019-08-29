export class AuthMethodModel {
  authMethodName: string;
  location?: string;
  authMethodConstant: AuthMethodType

  constructor(authMethodName: string, location?: string) {
    this.authMethodName = authMethodName;
    this.location = location;
    switch (authMethodName) {
      case 'ip': {
        this.authMethodConstant = AuthMethodType.Ip;
        break;
      }
      case 'ldap': {
        this.authMethodConstant = AuthMethodType.Ldap;
        break;
      }
      case 'shibboleth': {
        this.authMethodConstant = AuthMethodType.Shibboleth;
        break;
      }
      case 'x509': {
        this.authMethodConstant = AuthMethodType.X509;
        break;
      }
      case 'password': {
        this.authMethodConstant = AuthMethodType.Password;
        break;
      }

      default: {
        break;
      }
    }
  }
}

export enum AuthMethodType {
  Password = 'password',
  Shibboleth = 'shibboleth',
  Ldap = 'ldap',
  Ip = 'ip',
  X509 = 'x509'
}
