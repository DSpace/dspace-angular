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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { hasValue } from '../../../empty.util';
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
