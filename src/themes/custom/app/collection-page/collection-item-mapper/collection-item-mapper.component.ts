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
import { SearchConfigurationService } from 'src/app/core/shared/search/search-configuration.service';
import {
  fadeIn,
  fadeInOut,
} from 'src/app/shared/animations/fade';

import { CollectionItemMapperComponent as BaseComponent } from '../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { ItemSelectComponent } from '../../../../../app/shared/object-select/item-select/item-select.component';
import { ThemedSearchFormComponent } from '../../../../../app/shared/search-form/themed-search-form.component';
import { BrowserOnlyPipe } from '../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-collection-item-mapper',
  styleUrls: ['../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component.scss'],
  // styleUrls: ['./collection-item-mapper.component.scss'],
  templateUrl: '../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component.html',
  // templateUrl: './collection-item-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    ThemedSearchFormComponent,
    NgbNavModule,
    TranslateModule,
    AsyncPipe,
    ItemSelectComponent,
    NgIf,
    BrowserOnlyPipe,
  ],
  standalone: true,
})
export class CollectionItemMapperComponent extends BaseComponent {

}
