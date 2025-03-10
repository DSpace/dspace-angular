import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  map,
  Observable,
  of as observableOf,
} from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { hasValue } from 'src/app/shared/empty.util';
import { environment } from 'src/environments/environment';

import { AccessStatusObject } from '../access-status-badge/access-status.model';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';

@Component({
  selector: 'ds-base-embargo-badge',
  templateUrl: './embargo-badge.component.html',
  styleUrls: ['./embargo-badge.component.scss'],
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslateModule],
})
/**
 * Component rendering the embargo date of a bitstream as a badge
 */
export class EmbargoBadgeComponent implements OnInit {

  @Input() bitstream: Bitstream;

  embargoDate$: Observable<string>;

  /**
   * Whether to show the badge or not
   */
  showAccessStatus: boolean;

  ngOnInit(): void {
    this.showAccessStatus = environment.item.bitstream.showAccessStatuses;
    if (!this.showAccessStatus || this.bitstream == null || this.bitstream.accessStatus == null) {
      // Do not show the badge if the feature is inactive or if the bitstream is null.
      return;
    }
    this.embargoDate$ = this.bitstream.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus) ? accessStatus.embargoDate : null),
      catchError(() => observableOf(null)),
    );
  }
}
