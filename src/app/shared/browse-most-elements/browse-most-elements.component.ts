import {
  AsyncPipe,
  LowerCasePipe,
} from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { BehaviorSubject } from 'rxjs';

import {
  TopSection,
  TopSectionTemplateType,
} from '../../core/layout/models/section.model';
import { Context } from '../../core/shared/context.model';
import { ThemedDefaultBrowseElementsComponent } from './default-browse-elements/themed-default-browse-elements.component';

/**
 * Container component that delegates rendering of browse elements to the appropriate
 * template component based on the {@link TopSection} configuration.
 * Currently supports the default template via {@link DefaultBrowseElementsComponent}.
 */
@Component({
  selector: 'ds-base-browse-most-elements',
  styleUrls: ['./browse-most-elements.component.scss'],
  templateUrl: './browse-most-elements.component.html',
  imports: [
    AsyncPipe,
    LowerCasePipe,
    ThemedDefaultBrowseElementsComponent,
  ],
})

export class BrowseMostElementsComponent implements OnInit, OnChanges {

  /**
   * The pagination options
   */
  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  /**
   * The context of listable object
   */
  @Input() context: Context;

  /**
   * Optional projection to use during the search
   */
  @Input() projection;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel: boolean;

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics: boolean;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails: boolean;

  /*
   * The top section object
   */
  @Input() topSection: TopSection;

  /** BehaviorSubject re-emitting paginatedSearchOptions to trigger child component updates. */
  paginatedSearchOptions$ = new BehaviorSubject<PaginatedSearchOptions>(null);

  /** The resolved template type determining which child component renders the results. */
  sectionTemplateType: TopSectionTemplateType;

  ngOnInit(): void {
    this.sectionTemplateType = this.topSection?.template ?? TopSectionTemplateType.DEFAULT;
  }

  ngOnChanges() { // trigger change detection on child components
    this.paginatedSearchOptions$.next(this.paginatedSearchOptions);
  }
}
