import { Component } from '@angular/core';
import { renderStartsWithFor, StartsWithType } from '../starts-with-decorator';
import { StartsWithAbstractComponent } from '../starts-with-abstract.component';

/**
 * A switchable component rendering StartsWith options for the type "Date".
 * The options are rendered in a dropdown with an input field (of type number) next to it.
 */
@Component({
  selector: 'ds-starts-with-date',
  styleUrls: ['./starts-with-date.component.scss'],
  templateUrl: './starts-with-date.component.html'
})
@renderStartsWithFor(StartsWithType.date)
export class StartsWithDateComponent extends StartsWithAbstractComponent {

  /**
   * Get startsWith as a number;
   */
  getStartsWith() {
    return +this.startsWith;
  }

  /**
   * Add/Change the url query parameter startsWith using the local variable
   */
  setStartsWithParam() {
    if (this.startsWith === '-1') {
      this.startsWith = undefined;
    }
    super.setStartsWithParam();
  }

}
