import { default as decode } from 'jwt-decode';

export const TOKENITEM = 'dsAuthInfo';

export class AuthTokenInfo {
  public accessToken: string;
  public expires: number;

  constructor(token: string) {
    this.accessToken = token.replace('Bearer ', '');
    const tokenClaims = decode(this.accessToken);
    // exp claim is in seconds, convert it se to milliseconds
    this.expires = tokenClaims.exp * 1000;
  }
}
