import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { getItemPageRoute } from '../../../../item-page/item-page-routing-paths';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';

@Component({
  selector: 'ds-item-metadata-representation-list-element',
  template: '',
  standalone: true,
})
/**
 * An abstract class for displaying a single ItemMetadataRepresentation
 */
export class ItemMetadataRepresentationListElementComponent extends MetadataRepresentationListElementComponent implements OnInit {
  @Input() mdRepresentation: ItemMetadataRepresentation;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.mdRepresentation);
  }
}
