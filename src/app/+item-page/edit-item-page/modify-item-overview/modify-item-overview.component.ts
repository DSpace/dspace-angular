import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../core/shared/item.model';
import {Metadatum} from '../../../core/shared/metadatum.model';

@Component({
  selector: 'ds-modify-item-overview',
  templateUrl: './modify-item-overview.component.html'
})
/**
 * Component responsible for rendering a table containing the metadatavalues from the to be edited item
 */
export class ModifyItemOverviewComponent implements OnInit {

  @Input() item: Item;
  metadata: Metadatum[];

  ngOnInit(): void {
    this.metadata = this.item.metadata;
  }
}
