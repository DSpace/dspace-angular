import { AuthMethodType } from '../../../shared/log-in/methods/authMethods-type';

export class InjectedAuthMethodModel {
  authMethodType: AuthMethodType;
  location?: string;
  isStandalonePage?: boolean;

  constructor(authMethodName: AuthMethodType, location?: string, isStandAlonePage?: boolean) {
    this.authMethodType = authMethodName;
    this.location = location;
    this.isStandalonePage = isStandAlonePage;
  }
}
