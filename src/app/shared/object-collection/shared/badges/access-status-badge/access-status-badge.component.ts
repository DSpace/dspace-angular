import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';
import { AccessStatusDataService } from 'src/app/core/data/access-status-data.service';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { environment } from 'src/environments/environment';

import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { Item } from '../../../../../core/shared/item.model';
import { hasValue } from '../../../../empty.util';
import { AccessStatusObject } from './access-status.model';

@Component({
  selector: 'ds-base-access-status-badge',
  templateUrl: './access-status-badge.component.html',
  styleUrls: ['./access-status-badge.component.scss'],
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
})
/**
 * Component rendering the access status of an item as a badge
 */
export class AccessStatusBadgeComponent implements OnDestroy, OnInit {

  @Input() object: DSpaceObject;

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
   * @param {AccessStatusDataService} accessStatusDataService
   */
  constructor(private accessStatusDataService: AccessStatusDataService) { }

  ngOnInit(): void {
    if (!hasValue(this.object)) {
      return;
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
    const item = this.object as Item;
    if (item.accessStatus == null) {
      // In case the access status has not been loaded, do it individually.
      item.accessStatus = this.accessStatusDataService.findItemAccessStatusFor(item);
    }
    this.accessStatus$ = item.accessStatus.pipe(
      map((accessStatusRD) => {
        if (accessStatusRD.statusCode !== 401 && hasValue(accessStatusRD.payload)) {
          return accessStatusRD.payload;
        } else {
          return [];
        }
      }),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.status) ? accessStatus.status : 'unknown'),
      map((status: string) => `access-status.${status.toLowerCase()}.listelement.badge`),
      catchError(() => observableOf('access-status.unknown.listelement.badge')),
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
    const bitstream = this.object as Bitstream;
    if (bitstream.accessStatus == null) {
      return;
    }
    this.embargoDate$ = bitstream.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => {
        if (hasValue(accessStatus.embargoDate)) {
          this.accessStatus$ = observableOf('embargo.listelement.badge');
          return accessStatus.embargoDate;
        } else {
          this.accessStatus$ = observableOf(null);
          return null;
        }
      }),
      catchError(() => observableOf(null)),
    );
  }
}
