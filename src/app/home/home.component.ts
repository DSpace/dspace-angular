import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import {SpinnerService} from "../spinner/spinner.service";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [SpinnerService],
  selector: 'ds-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  data: any = {};

  constructor(
      private spinner : SpinnerService
  ) {
    spinner.activate();

    /* DELAY FOR TESTING SPINNER */
    setTimeout(() => {
      spinner.deactivate();
    }, 2000);
    this.universalInit();
  }

  universalInit() {

  }

}
