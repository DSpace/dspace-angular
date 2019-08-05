export class AuthMethodModel {
  authMethodName: string;
  location?: string;

  constructor(authMethodName: string, location?: string) {
    this.authMethodName = authMethodName;
    this.location = location;
  }
}
