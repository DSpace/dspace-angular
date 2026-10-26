import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { validate as uuidValidate } from 'uuid';

import { SearchService } from '../../../../../../../app/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../../app/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../../../app/shared/search/search-filters/search-filter.service';
import { SearchLabelComponent as BaseComponent } from '../../../../../../../app/shared/search/search-labels/search-label/search-label.component';

@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
  styleUrls: ['./search-label.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class RdappSearchLabelComponent extends BaseComponent implements OnInit {

  /**
   * Texto do valor no chip. O backend devolve o UUID como rótulo do filtro Depositante (não há autoridade que
   * resolva o nome), então ele é trocado pelo nome da pessoa (HU012 CA03.1, D7, M3). Se a leitura falhar,
   * fica o rótulo original.
   */
  label$: Observable<string>;

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected searchFilterService: SearchFilterService,
    protected epersonService: EPersonDataService,
    protected dsoNameService: DSONameService,
  ) {
    super(paginationService, router, searchConfigurationService, searchService, searchFilterService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const label = this.appliedFilter.label;
    if (this.appliedFilter.filter === 'submitter' && uuidValidate(label)) {
      this.label$ = this.epersonService.findById(label).pipe(
        getFirstCompletedRemoteData(),
        map((rd) => rd.hasSucceeded && rd.payload ? this.dsoNameService.getName(rd.payload) : label),
      );
    } else {
      this.label$ = of(label);
    }
  }
}
