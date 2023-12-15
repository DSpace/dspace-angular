import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticate = true;

  login() {
    this.isAuthenticate = true;
  }

  logout() {
    this.isAuthenticate = false;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticate;
  }
}
