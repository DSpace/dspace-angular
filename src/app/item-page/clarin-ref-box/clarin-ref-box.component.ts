import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';

/**
 * The component which wraps the `ds-clarin-ref-citation` and `ds-clarin-ref-featured-services` component.
 */
@Component({
  selector: 'ds-clarin-ref-box',
  templateUrl: './clarin-ref-box.component.html',
  styleUrls: ['./clarin-ref-box.component.scss']
})
export class ClarinRefBoxComponent implements OnInit {

  @Input() item: Item;

  // tslint:disable-next-line:no-empty
  constructor() { }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
  }

}
