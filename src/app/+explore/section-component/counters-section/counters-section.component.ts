import { DSpaceObject } from './../../../core/shared/dspace-object.model';
import { SearchObjects } from './../../../shared/search/search-objects.model';
import { getFirstSucceededRemoteDataPayload } from './../../../core/shared/operators';
import { PaginationComponentOptions } from './../../../shared/pagination/pagination-component-options.model';
import { SectionComponent } from './../../../core/layout/models/section.model';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { SearchService } from './../../../core/shared/search/search.service';
import { Component, Input, OnInit } from '@angular/core';
import { PaginatedSearchOptions } from './../../../shared/search/paginated-search-options.model';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'ds-counters-section',
  templateUrl: './counters-section.component.html'
})
export class CountersSectionComponent implements OnInit {

    @Input()
    sectionId: string;

    @Input()
    countersSection: CountersSection;

    counterData: CounterData[] = [];
    counterData$: Observable<CounterData[]>;
    isLoading$ = new BehaviorSubject(true);


  constructor(private searchService: SearchService) {

   }

  ngOnInit() {
    this.counterData$ = forkJoin(
    this.countersSection.counterSettingsList.map((counterSettings: CountersSettings) =>
    this.searchService.search(new PaginatedSearchOptions({
      configuration: counterSettings.discoveryConfigurationName,
      pagination: this.pagination})).pipe(
        getFirstSucceededRemoteDataPayload(),
        map((rs: SearchObjects<DSpaceObject>) => rs.totalElements),
        map((total: number) => {
          return {
            count: total.toString(),
            label: counterSettings.entityName,
            icon: counterSettings.icon,
            link: counterSettings.link

          };
        })
    )));
    this.counterData$.subscribe(() => this.isLoading$.next(false));
  }
}

export interface CountersSection extends SectionComponent {
  componentType: 'counters';
  counterSettingsList: CountersSettings[];
}

export interface CountersSettings {
  discoveryConfigurationName: string;
  entityName: string;
  icon: string;
  link: string;
}

export interface CounterData {
  label: string;
  count: string;
  icon: string;
  link: string;
}
