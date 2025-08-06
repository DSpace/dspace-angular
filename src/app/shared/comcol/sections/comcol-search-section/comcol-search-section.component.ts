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
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Collection } from '@dspace/core/shared/collection.model';
import { Community } from '@dspace/core/shared/community.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationService } from '../../../search/search-configuration.service';
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
    AsyncPipe,
    ThemedSearchComponent,
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
    this.comcol$ = this.route.parent.data.pipe(
      map((data: Data) => (data.dso as RemoteData<Community | Collection>).payload),
    );
    this.showSidebar$ = this.comcol$.pipe(
      map((comcol: Community | Collection) => hasValue(comcol) && this.appConfig[comcol.type as any].searchSection.showSidebar),
    );
  }

}
