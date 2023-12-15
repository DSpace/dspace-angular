import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  showHeader: boolean = true;
  hide:boolean = false;

  toggleHeader() {
    debugger;
    this.showHeader = !this.showHeader;
  }
}
