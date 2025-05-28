
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-base-item-page-title-field',
  templateUrl: './item-page-title-field.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
/**
 * This component is used for displaying the title (defined by the {@link DSONameService}) of an item
 */
export class ItemPageTitleFieldComponent {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  constructor(
    public dsoNameService: DSONameService,
  ) {
  }

}
