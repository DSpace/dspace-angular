import { Component } from '@angular/core';
import { SpinnerService } from "../spinner/spinner.service";
import {Observable} from 'rxjs';


@Component({
  selector: 'ds-router-outlet-with-spinner',
  styleUrls: ['./router-outlet-with-spinner.component.css'],
  templateUrl: './router-outlet-with-spinner.component.html'
})
export class RouterOutletWithSpinnerComponent {

  active: Observable<boolean>;
  data: any = {};

  constructor(
      private spinner : SpinnerService
  ) {
    this.universalInit();
    this.active = spinner.isActive();
  }

  universalInit() {

  }

}
