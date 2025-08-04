import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { AccessStatusObject } from '@dspace/core/shared/access-status.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ds-base-access-status-badge',
  templateUrl: './access-status-badge.component.html',
  styleUrls: ['./access-status-badge.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Component rendering the access status of an item as a badge
 */
export class AccessStatusBadgeComponent implements OnDestroy, OnInit {

  @Input() object: Item | Bitstream;

  accessStatus$: Observable<string>;
  embargoDate$: Observable<string>;

  /**
   * Whether to show the access status badge or not
   */
  showAccessStatus: boolean;

  /**
   * Value based stylesheet class for access status badge
   */
  accessStatusClass: string;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {LinkService} linkService
   */
  constructor(
    private linkService: LinkService,
  ) { }

  ngOnInit(): void {
    if (!hasValue(this.object)) {
      return;
    }
    if (!hasValue(this.object.accessStatus)) {
      // In case the access status has not been loaded, do it individually.
      this.linkService.resolveLink(this.object, followLink('accessStatus'));
    }
    switch ((this.object as any).type) {
      case Item.type.value:
        this.handleItem();
        break;
      case Bitstream.type.value:
        this.handleBitstream();
        break;
    }
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Method to handle the object type Item
   */
  private handleItem() {
    this.showAccessStatus = environment.item.showAccessStatuses;
    if (!this.showAccessStatus) {
      // Do not show the badge if the feature is inactive.
      return;
    }
    this.accessStatus$ = this.object.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.status) ? accessStatus.status : 'unknown'),
      map((status: string) => `access-status.${status.toLowerCase()}.listelement.badge`),
      catchError(() => of('access-status.unknown.listelement.badge')),
    );
    // stylesheet based on the access status value
    this.subs.push(
      this.accessStatus$.pipe(
        map((accessStatusClass: string) => accessStatusClass.replace(/\./g, '-')),
      ).subscribe((accessStatusClass: string) => {
        this.accessStatusClass = accessStatusClass;
      }),
    );
  }

  /**
   * Method to handle the object type Bitstream
   */
  private handleBitstream() {
    this.showAccessStatus = environment.item.bitstream.showAccessStatuses;
    if (!this.showAccessStatus) {
      // Do not show the badge if the feature is inactive.
      return;
    }
    this.embargoDate$ = this.object.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.embargoDate) ? accessStatus.embargoDate : null),
      catchError(() => of(null)),
    );
    this.subs.push(
      this.embargoDate$.pipe().subscribe((embargoDate: string) => {
        if (hasValue(embargoDate)) {
          this.accessStatus$ = of('embargo.listelement.badge');
        }
      }),
    );
  }
}
