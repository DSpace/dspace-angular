import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { ThumbnailComponent } from '../../../../../thumbnail/thumbnail.component';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-person-search-result-list-element',
  styleUrls: ['./person-search-result-list-element.component.scss'],
  templateUrl: './person-search-result-list-element.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, ThumbnailComponent, NgClass, ThemedBadgesComponent, TruncatableComponent, TruncatablePartComponent, NgFor, AsyncPipe, TranslateModule],
})
/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  public constructor(
    protected truncatableService: TruncatableService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Display thumbnail if required by configuration
   */
  showThumbnails: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }
}
