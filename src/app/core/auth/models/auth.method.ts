import { AuthMethodType } from './auth.method-type';

export class AuthMethod {
  authMethodType: AuthMethodType;
  position: number;
  location?: string;

  constructor(authMethodName: string, position: number, location?: string) {
    this.position = position;

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
        this.location = location;
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
      case 'oidc': {
        this.authMethodType = AuthMethodType.Oidc;
        this.location = location;
        break;
      }
      case 'orcid': {
        this.authMethodType = AuthMethodType.Orcid;
        this.location = location;
        break;
      }
      case 'saml': {
        this.authMethodType = AuthMethodType.Saml;
        this.location = location;
        break;
      }

      default: {
        break;
      }
    }
  }
}
