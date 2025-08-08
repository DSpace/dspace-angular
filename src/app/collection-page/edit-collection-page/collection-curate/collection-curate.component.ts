import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Collection } from '@dspace/core/shared/collection.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { CurationFormComponent } from '../../../curation-form/curation-form.component';

/**
 * Component for managing a collection's curation tasks
 */
@Component({
  selector: 'ds-collection-curate',
  templateUrl: './collection-curate.component.html',
  imports: [
    AsyncPipe,
    CurationFormComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class CollectionCurateComponent implements OnInit {
  dsoRD$: Observable<RemoteData<Collection>>;
  collectionName$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      take(1),
      map((data) => data.dso),
    );

    this.collectionName$ = this.dsoRD$.pipe(
      filter((rd: RemoteData<Collection>) => hasValue(rd)),
      map((rd: RemoteData<Collection>) => {
        return this.dsoNameService.getName(rd.payload);
      }),
    );
  }
}
