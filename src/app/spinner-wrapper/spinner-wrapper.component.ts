import { Component, OnInit } from '@angular/core';
import { SpinnerService } from "../spinner/spinner.service";
import {Observable} from 'rxjs';


@Component({
    selector: 'ds-spinner-wrapper',
    styleUrls: ['./spinner-wrapper.component.css'],
    templateUrl: './spinner-wrapper.component.html'
})

export class SpinnerWrapperComponent implements OnInit  {

    active: Observable<boolean>;

    constructor(
        private spinner : SpinnerService
    ) {

    }

    ngOnInit(): void {
        this.active = this.spinner.isActive();
    }


}
