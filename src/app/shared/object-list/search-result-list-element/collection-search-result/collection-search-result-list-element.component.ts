import {
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Collection } from '../../../../core/shared/collection.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../search-result-list-element.component';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html',
  standalone: true,
  imports: [NgIf, NgClass, ThemedBadgesComponent, RouterLink],
})
/**
 * Component representing a collection search result in list view
 */
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> implements OnInit {

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  constructor(protected truncatableService: TruncatableService,
              public dsoNameService: DSONameService,
              public translateService: TranslateService,
              @Inject(APP_CONFIG) protected appConfig?: AppConfig) {
    super(truncatableService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }

}
