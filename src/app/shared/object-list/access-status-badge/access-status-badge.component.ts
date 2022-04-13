import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { AccessStatusObject } from './access-status.model';
import { hasValue } from '../../empty.util';

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
   * Initialize instance variables
   *
   * @param {ItemDataService} itemDataService
   */
  constructor(private itemDataService: ItemDataService) { }

  ngOnInit(): void {
    this._accessStatus$ = this.itemDataService
      .getAccessStatus(this._uuid)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((accessStatus: AccessStatusObject) => hasValue(accessStatus.status) ? accessStatus.status : 'unknown'),
        map((status: string) => `access-status.${status.toLowerCase()}.listelement.badge`)
      );
  }

  @Input() set uuid(uuid: string) {
    this._uuid = uuid;
  }

  get accessStatus$(): Observable<string> {
    return this._accessStatus$;
  }
}
