import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchConfigurationService } from 'src/app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from 'src/app/my-dspace-page/my-dspace-page.component';
import { fadeIn, fadeInOut } from 'src/app/shared/animations/fade';
import {
  CollectionItemMapperComponent as BaseComponent
} from '../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component';

@Component({
  selector: 'ds-collection-item-mapper',
  styleUrls: ['../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component.scss'],
  // styleUrls: ['./collection-item-mapper.component.scss'],
  templateUrl: '../../../../../app/collection-page/collection-item-mapper/collection-item-mapper.component.html',
  // templateUrl: './collection-item-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class CollectionItemMapperComponent extends BaseComponent {

}
