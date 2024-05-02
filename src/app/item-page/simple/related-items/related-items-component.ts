import {
  AsyncPipe,
  isPlatformBrowser,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ListableObjectComponentLoaderComponent } from '../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { setPlaceHolderAttributes } from '../../../shared/utils/object-list-utils';
import { VarDirective } from '../../../shared/utils/var.directive';
import { AbstractIncrementalListComponent } from '../abstract-incremental-list/abstract-incremental-list.component';

@Component({
  selector: 'ds-related-items',
  styleUrls: ['./related-items.component.scss'],
  templateUrl: './related-items.component.html',
  standalone: true,
  imports: [MetadataFieldWrapperComponent, NgClass, NgFor, VarDirective, ListableObjectComponentLoaderComponent, NgIf, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})
/**
 * This component is used for displaying relations between items
 * It expects a parent item and relationship type, as well as a label to display on top
 */
export class RelatedItemsComponent extends AbstractIncrementalListComponent<Observable<RemoteData<PaginatedList<Item>>>> {

  /**
   * The parent of the list of related items to display
   */
  @Input() parentItem: Item;

  /**
   * The label of the relationship type to display
   * Used in sending a search request to the REST API
   */
  @Input() relationType: string;

  /**
   * The amount to increment the list by when clicking "view more"
   * Defaults to 5
   * The default can optionally be overridden by providing the limit as input to the component
   */
  @Input() incrementBy = 5;

  /**
   * Default options to start a search request with
   * Optional input
   */
  @Input() options = new FindListOptions();

  /**
   * An i18n label to use as a title for the list (usually describes the relation)
   */
  @Input() label: string;

  /**
   * The view-mode we're currently on
   * @type {ViewMode}
   */
  viewMode = ViewMode.ListElement;

  /**
   * Determines whether to request embedded thumbnail.
   */
  fetchThumbnail: boolean;

  constructor(public relationshipService: RelationshipDataService,
              protected elementRef: ElementRef,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
              @Inject(PLATFORM_ID) private platformId: any,
  ) {
    super();
    this.fetchThumbnail = this.appConfig.browseBy.showThumbnails;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = this.elementRef.nativeElement.offsetWidth;
      this.placeholderFontClass = setPlaceHolderAttributes(width);
    } else {
      this.placeholderFontClass = 'hide-placeholder-text';
    }
    super.ngOnInit();
  }

  /**
   * Get a specific page
   * @param page  The page to fetch
   */
  getPage(page: number): Observable<RemoteData<PaginatedList<Item>>> {
    return this.relationshipService.getRelatedItemsByLabel(this.parentItem, this.relationType, Object.assign(this.options,
      { elementsPerPage: this.incrementBy, currentPage: page, fetchThumbnail: this.fetchThumbnail }));
  }
}
