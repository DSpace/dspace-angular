import { Component, Inject, Input, OnInit } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { fadeInOut } from '../../../animations/fade';
import { SearchResult } from '../../../search/models/search-result.model';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Context } from '../../../../core/shared/context.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import {
  DuplicateMatchMetadataDetailConfig
} from '../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';
import { parseISO, differenceInDays, differenceInMilliseconds } from 'date-fns';
import { environment } from '../../../../../environments/environment';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { Observable } from 'rxjs';

/**
 * This component show metadata for the given item object in the list view.
 */
@Component({
  selector: 'ds-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut]
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

  authorMetadataLimit = environment.followAuthorityMetadataValuesLimit;

  isCollapsed$: Observable<boolean>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    public dsoNameService: DSONameService,
    public truncateService: TruncatableService
  ) {
  }

  getDateForArchivedItem(itemStartDate: string, dateAccessioned: string) {
    const itemStartDateConverted: Date = parseISO(itemStartDate);
    const dateAccessionedConverted: Date = parseISO(dateAccessioned);
    const days: number = Math.floor(differenceInDays(dateAccessionedConverted, itemStartDateConverted));
    const remainingMilliseconds: number = differenceInMilliseconds(dateAccessionedConverted, itemStartDateConverted) - days * 24 * 60 * 60 * 1000;
    const hours: number = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
    return `${days} d ${hours} h`;
  }

  ngOnInit(): void {
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.item);
    this.isCollapsed$ = this.truncateService.isCollapsed(this.item.uuid);
  }
}
