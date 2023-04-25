import { Component } from '@angular/core';
import { filter, map, shareReplay } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Collection } from '../../../core/shared/collection.model';
import { hasValue } from '../../../shared/empty.util';

/**
 * Component for managing a collection's curation tasks
 */
@Component({
  selector: 'ds-item-curate',
  templateUrl: './item-curate.component.html',
})
export class ItemCurateComponent {
  dsoRD$: Observable<RemoteData<Collection>> = this.route.parent.data.pipe(
    map((data) => data.dso),
    shareReplay(1)
  );

  itemName$: Observable<string> = this.dsoRD$.pipe(
    filter((rd: RemoteData<Collection>) => hasValue(rd)),
    map((rd: RemoteData<Collection>) => {
      console.log(rd);
      return this.dsoNameService.getName(rd.payload);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private dsoNameService: DSONameService,
  ) {}
}
