import { Component, Input } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { AccessStatusObject } from './access-status.model';
import { hasValue } from '../../../../empty.util';
import { environment } from 'src/environments/environment';
import { AccessStatusDataService } from 'src/app/core/data/access-status-data.service';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { Item } from '../../../../../core/shared/item.model';
import { ITEM } from '../../../../../core/shared/item.resource-type';

@Component({
  selector: 'ds-access-status-badge',
  templateUrl: './access-status-badge.component.html',
  styleUrls: ['./access-status-badge.component.scss']
})
/**
 * Component rendering the access status of an item as a badge
 */
export class AccessStatusBadgeComponent {

  @Input() object: DSpaceObject;
  accessStatus$: Observable<string>;

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
    this.showAccessStatus = environment.item.showAccessStatuses;
    if (this.object.type.toString() !== ITEM.value || !this.showAccessStatus || this.object == null) {
      // Do not show the badge if the feature is inactive or if the item is null.
      return;
    }

    const item = this.object as Item;
    if (item.accessStatus == null) {
      // In case the access status has not been loaded, do it individually.
      item.accessStatus = this.accessStatusDataService.findAccessStatusFor(item);
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
      catchError(() => observableOf('access-status.unknown.listelement.badge'))
    );

    // stylesheet based on the access status value
    this.subs.push(
      this.accessStatus$.pipe(
        map((accessStatusClass: string) => accessStatusClass.replace(/\./g, '-'))
      ).subscribe((accessStatusClass: string) => {
        this.accessStatusClass = accessStatusClass;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
