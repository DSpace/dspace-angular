import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataDirective } from '../../../../../shared/metadata.directive';

@Component({
  selector: 'ds-base-item-page-title-field',
  templateUrl: './item-page-title-field.component.html',
  imports: [
    MetadataDirective,
    TranslateModule,
  ],
})
/**
 * This component is used for displaying the title (defined by the {@link DSONameService}) of an item
 */
export class ItemPageTitleFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  nameMetadata: MetadataValue;

  constructor(
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit() {
    const name = this.dsoNameService.getName(this.item);
    const language = this.dsoNameService.getNameLanguage(this.item);

    this.nameMetadata = Object.assign(new MetadataValue(), {
      value: name,
      language: language,
    });
  }

}
