export const TOKENITEM = 'dsAuthInfo';

export class AuthTokenInfo {
  public accessToken: string;
  public expires?: number;

  constructor(token: string, expiresIn?: number) {
    this.accessToken = token.replace('Bearer ', '');
    if (expiresIn) {
      this.expires = expiresIn * 1000 + Date.now();
    }
  }
}
