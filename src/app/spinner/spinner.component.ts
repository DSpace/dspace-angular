import { Component } from '@angular/core';


@Component({
  selector: 'ds-spinner',
  styleUrls: ['./spinner.component.css'],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {

  data: any = {};

  constructor() {
    this.universalInit();
  }

  universalInit() {

  }

}
