import { KeyValuePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '@dspace/core';
import { MetadataMap } from '@dspace/core';

@Component({
  selector: 'ds-modify-item-overview',
  templateUrl: './modify-item-overview.component.html',
  standalone: true,
  imports: [KeyValuePipe, TranslateModule],
})
/**
 * Component responsible for rendering a table containing the metadatavalues from the to be edited item
 */
export class ModifyItemOverviewComponent implements OnChanges  {

  @Input() item: Item;
  metadata: MetadataMap;

  ngOnChanges(): void {
    this.metadata = this.item?.metadata;
  }
}
