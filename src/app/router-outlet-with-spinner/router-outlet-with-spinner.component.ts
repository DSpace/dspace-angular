import { Component, OnInit } from '@angular/core';
import { SpinnerService } from "../spinner/spinner.service";
import {Observable} from 'rxjs';


@Component({
  selector: 'ds-router-outlet-with-spinner',
  styleUrls: ['./router-outlet-with-spinner.component.css'],
  templateUrl: './router-outlet-with-spinner.component.html'
})
export class RouterOutletWithSpinnerComponent implements OnInit  {

  active: Observable<boolean>;

  constructor(
      private spinner : SpinnerService
  ) {

  }

  ngOnInit(): void {
    this.active = this.spinner.isActive();
  }

 
}
