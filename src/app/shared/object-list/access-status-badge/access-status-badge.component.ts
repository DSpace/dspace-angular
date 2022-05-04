import { Component, Input } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { AccessStatusObject } from './access-status.model';
import { hasValue } from '../../empty.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ds-access-status-badge',
  templateUrl: './access-status-badge.component.html'
})
/**
 * Component rendering the access status of an item as a badge
 */
export class AccessStatusBadgeComponent {

  private _uuid: string;
  private _accessStatus$: Observable<string>;

  /**
   * Whether to show the access status badge or not
   */
  showAccessStatus: boolean;

  /**
   * Initialize instance variables
   *
   * @param {ItemDataService} itemDataService
   */
  constructor(private itemDataService: ItemDataService) { }

  ngOnInit(): void {
    this.showAccessStatus = environment.item.showAccessStatuses;
    this._accessStatus$ = this.itemDataService
      .getAccessStatus(this._uuid)
      .pipe(
        getFirstCompletedRemoteData(),
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
  }

  @Input() set uuid(uuid: string) {
    this._uuid = uuid;
  }

  get accessStatus$(): Observable<string> {
    return this._accessStatus$;
  }
}
