import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { CurationFormComponent } from '../../../curation-form/curation-form.component';
import { hasValue } from '../../../shared/empty.util';

/**
 * Component for managing a collection's curation tasks
 */
@Component({
  selector: 'ds-item-curate',
  templateUrl: './item-curate.component.html',
  imports: [
    CurationFormComponent,
    NgIf,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class ItemCurateComponent implements OnInit {
  dsoRD$: Observable<RemoteData<Item>>;
  itemName$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private dsoNameService: DSONameService,
  ) {}

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      take(1),
      map((data) => data.dso),
    );

    this.itemName$ = this.dsoRD$.pipe(
      filter((rd: RemoteData<Item>) => hasValue(rd)),
      map((rd: RemoteData<Item>) => {
        return this.dsoNameService.getName(rd.payload);
      }),
    );
  }
}
