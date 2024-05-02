import {
  KeyValuePipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../core/shared/item.model';
import { MetadataMap } from '../../../core/shared/metadata.models';

@Component({
  selector: 'ds-modify-item-overview',
  templateUrl: './modify-item-overview.component.html',
  standalone: true,
  imports: [NgFor, KeyValuePipe, TranslateModule],
})
/**
 * Component responsible for rendering a table containing the metadatavalues from the to be edited item
 */
export class ModifyItemOverviewComponent implements OnInit {

  @Input() item: Item;
  metadata: MetadataMap;

  ngOnInit(): void {
    this.metadata = this.item.metadata;
  }
}
