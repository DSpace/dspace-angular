import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Community } from '@dspace/core/shared/community.model';
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
 * Component for managing a community's curation tasks
 */
@Component({
  selector: 'ds-community-curate',
  templateUrl: './community-curate.component.html',
  imports: [
    AsyncPipe,
    CurationFormComponent,
    TranslateModule,
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
