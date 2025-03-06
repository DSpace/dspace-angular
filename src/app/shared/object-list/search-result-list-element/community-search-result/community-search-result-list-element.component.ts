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
import { environment } from '../../../../../environments/environment';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Community } from '../../../../core/shared/community.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../search-result-list-element.component';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'community-search-result-list-element.component.scss'],
  templateUrl: 'community-search-result-list-element.component.html',
  standalone: true,
  imports: [NgIf, NgClass, ThemedBadgesComponent, RouterLink],
})
/**
 * Component representing a community search result in list view
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement)
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> implements OnInit {
  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  /**
   * The current language of the page
   */
  currentLanguage: string = environment.defaultLanguage;

  constructor(protected truncatableService: TruncatableService,
              public dsoNameService: DSONameService,
              public translateService: TranslateService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);

    this.currentLanguage = translateService.currentLang;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }
}
