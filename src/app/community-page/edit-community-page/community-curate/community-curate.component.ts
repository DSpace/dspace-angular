import { AsyncPipe } from '@angular/common';
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
import { Community } from '../../../core/shared/community.model';
import { CurationFormComponent } from '../../../curation-form/curation-form.component';
import { hasValue } from '../../../shared/empty.util';

/**
 * Component for managing a community's curation tasks
 */
@Component({
  selector: 'ds-community-curate',
  templateUrl: './community-curate.component.html',
  imports: [
    CurationFormComponent,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class CommunityCurateComponent implements OnInit {

  dsoRD$: Observable<RemoteData<Community>>;
  communityName$: Observable<string>;

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

    this.communityName$ = this.dsoRD$.pipe(
      filter((rd: RemoteData<Community>) => hasValue(rd)),
      map((rd: RemoteData<Community>) => {
        return this.dsoNameService.getName(rd.payload);
      }),
    );
  }

}
