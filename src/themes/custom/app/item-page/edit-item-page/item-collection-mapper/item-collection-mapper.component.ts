import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  fadeIn,
  fadeInOut,
} from 'src/app/shared/animations/fade';

import { ItemCollectionMapperComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component';
import { CollectionSelectComponent } from '../../../../../../app/shared/object-select/collection-select/collection-select.component';
import { ThemedSearchFormComponent } from '../../../../../../app/shared/search-form/themed-search-form.component';
import { BrowserOnlyPipe } from '../../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-item-collection-mapper',
  styleUrls: ['../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component.scss'],
  // styleUrls: ['./item-collection-mapper.component.scss'],
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component.html',
  // templateUrl: './item-collection-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    NgbNavModule,
    CollectionSelectComponent,
    ThemedSearchFormComponent,
    AsyncPipe,
    TranslateModule,
    NgIf,
    BrowserOnlyPipe,
  ],
  standalone: true,
})

export class ItemCollectionMapperComponent extends BaseComponent {

}
