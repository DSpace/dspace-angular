import { Injectable } from "@angular/core";
@Injectable()
export class GlobalConstants {
  public static USER_KEY = '__vite_user';
  public static ACCESS_TOKEN_KEY = '__vite_access_token';
  public static ID_TOKEN_KEY = '__vite_id_token';
  public static REDIRECT_URL = '__vite_redirect_url';
  public static ACTIVE_USER_KEY = '__vite_active_user';
}
