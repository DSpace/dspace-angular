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
    // When done loading call spinner.deactivate();

    this.universalInit();
  }

  universalInit() {

  }

}
