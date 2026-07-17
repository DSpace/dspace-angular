import {
  AsyncPipe,
  isPlatformServer,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchManager } from '@dspace/core/browse/search-manager';
import { SectionComponent } from '@dspace/core/layout/models/section.model';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { InternalLinkService } from '@dspace/core/services/internal-link.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';


@Component({
  selector: 'ds-base-counters-section',
  styleUrls: ['./counters-section.component.scss'],
  templateUrl: './counters-section.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class CountersSectionComponent implements OnInit {

  @Input()
    sectionId: string;

  @Input()
    countersSection: CountersSection;

  counterData: CounterData[] = [];
  counterData$: Observable<CounterData[]>;
  isLoading$ = new BehaviorSubject(true);

  pagination: PaginationComponentOptions;


  constructor(
              public internalLinkService: InternalLinkService,
              private searchService: SearchManager,
              @Inject(PLATFORM_ID) private platformId: any,
  ) {

  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.pagination  = Object.assign(new PaginationComponentOptions(), {
      id: 'counters-pagination' + this.sectionId,
      pageSize: 1,
      currentPage: 1,
    });

    this.counterData$ = forkJoin(
      this.countersSection.counterSettingsList.map((counterSettings: CountersSettings) =>
        this.searchService.search(new PaginatedSearchOptions({
          configuration: counterSettings.discoveryConfigurationName,
          pagination: this.pagination })).pipe(
          getFirstSucceededRemoteDataPayload(),
          map((rs: SearchObjects<DSpaceObject>) => rs.totalElements),
          map((total: number) => {
            return {
              count: total.toString(),
              label: counterSettings.entityName,
              icon: counterSettings.icon,
              link: counterSettings.link,

            };
          }),
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
