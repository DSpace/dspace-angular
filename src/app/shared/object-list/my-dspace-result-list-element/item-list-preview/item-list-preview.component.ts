import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Context } from 'src/app/core/shared/context.model';
import { WorkflowItem } from 'src/app/core/submission/models/workflowitem.model';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../core/shared/item.model';
import { DuplicateMatchMetadataDetailConfig } from '../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { fadeInOut } from '../../../animations/fade';
import { MetadataLinkViewComponent } from '../../../metadata-link-view/metadata-link-view.component';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { ItemCollectionComponent } from '../../../object-collection/shared/mydspace-item-collection/item-collection.component';
import { ItemCorrectionComponent } from '../../../object-collection/shared/mydspace-item-correction/item-correction.component';
import { ItemSubmitterComponent } from '../../../object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { SearchResult } from '../../../search/models/search-result.model';
import { TruncatableComponent } from '../../../truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';
import { AdditionalMetadataComponent } from '../../search-result-list-element/additional-metadata/additional-metadata.component';

/**
 * This component show metadata for the given item object in the list view.
 */
@Component({
  selector: 'ds-base-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut],
  standalone: true,
  imports: [
    AsyncPipe,
    ItemCollectionComponent,
    ItemSubmitterComponent,
    NgClass,
    NgFor,
    NgIf,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
    MetadataLinkViewComponent,
    AdditionalMetadataComponent,
    ItemCorrectionComponent,
  ],
})
export class ItemListPreviewComponent implements OnInit {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * Represents the badge context
   */
  @Input() badgeContext: Context;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel: boolean;

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics = true;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails: boolean;

  /**
   * Whether to show if the item is a correction
   */
  @Input() showCorrection = false;

  /**
   * An object representing the duplicate match
   */
  @Input() metadataList: DuplicateMatchMetadataDetailConfig[] = [];

  /**
   * Represents the workflow of the item
   */
  @Input() workflowItem: WorkflowItem;

  dsoTitle: string;

  authorMetadata = environment.searchResult.authorMetadata;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.item);
  }

}
