import { Component, Input } from '@angular/core';
import { Item } from '../../core/shared/item.model';

/**
 * The component which wraps the `ds-clarin-ref-citation` and `ds-clarin-ref-featured-services` component.
 */
@Component({
  selector: 'ds-clarin-ref-box',
  templateUrl: './clarin-ref-box.component.html',
  styleUrls: ['./clarin-ref-box.component.scss']
})
export class ClarinRefBoxComponent {

  @Input() item: Item;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

}
