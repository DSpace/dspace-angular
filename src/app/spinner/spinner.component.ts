import { Component, OnInit  } from '@angular/core';
import { SpinnerService } from "./spinner.service";
import {Observable} from 'rxjs';


@Component({
  selector: 'ds-spinner',
  styleUrls: ['./spinner.component.css'],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {

  public active: Observable<boolean>;

  constructor(private spinner : SpinnerService) {

  }

  ngOnInit(): void {
    this.active = this.spinner.isActive();
  }


}
