import {
  AsyncPipe,
  isPlatformServer,
  NgClass,
  NgForOf,
  NgIf,
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
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { InternalLinkService } from 'src/app/core/services/internal-link.service';

import { SearchManager } from '../../../../core/browse/search-manager';
import { SectionComponent } from '../../../../core/layout/models/section.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../search/models/paginated-search-options.model';
import { SearchObjects } from '../../../search/models/search-objects.model';

@Component({
  selector: 'ds-base-counters-section',
  styleUrls: ['./counters-section.component.scss'],
  templateUrl: './counters-section.component.html',
  standalone: true,
  imports: [
    NgClass,
    ThemedLoadingComponent,
    NgIf,
    NgTemplateOutlet,
    TranslateModule,
    AsyncPipe,
    RouterLink,
    NgForOf,
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
