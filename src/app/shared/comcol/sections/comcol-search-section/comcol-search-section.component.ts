import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
} from '@angular/router';
import { hasValue } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { Collection } from '@dspace/core';
import { Community } from '@dspace/core';
import { SearchConfigurationService } from '@dspace/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { ThemedSearchComponent } from '../../../search/themed-search.component';

/**
 * The search tab on community & collection pages
 */
@Component({
  selector: 'ds-comcol-search-section',
  templateUrl: './comcol-search-section.component.html',
  styleUrls: ['./comcol-search-section.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    ThemedSearchComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class ComcolSearchSectionComponent implements OnInit {

  comcol$: Observable<Community | Collection>;

  showSidebar$: Observable<boolean>;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.comcol$ = this.route.data.pipe(
      map((data: Data) => (data.dso as RemoteData<Community | Collection>).payload),
    );
    this.showSidebar$ = this.comcol$.pipe(
      map((comcol: Community | Collection) => hasValue(comcol) && this.appConfig[comcol.type as any].searchSection.showSidebar),
    );
  }

}
