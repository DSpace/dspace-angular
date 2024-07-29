import { TopSection, TopSectionTemplateType } from './../../core/layout/models/section.model';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { Context } from '../../core/shared/context.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ds-browse-most-elements',
  styleUrls: ['./browse-most-elements.component.scss'],
  templateUrl: './browse-most-elements.component.html'
})

export class BrowseMostElementsComponent implements OnInit, OnChanges {

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() context: Context;

  showLabel: boolean;

  showMetrics = true;

  @Input() topSection: TopSection;

  paginatedSearchOptionsBS = new BehaviorSubject<PaginatedSearchOptions>(null);

  templateTypeEnum = TopSectionTemplateType;

  sectionTemplateType: TopSectionTemplateType;

  ngOnInit(): void {
    this.sectionTemplateType = this.topSection?.template ?? TopSectionTemplateType.DEFAULT;
  }

  ngOnChanges() { // trigger change detection on child components
    this.paginatedSearchOptionsBS.next(this.paginatedSearchOptions);
  }
}
