import { Component, Input } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { hasValue } from '../../empty.util';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/core/shared/item.model';
import { AccessStatusDataService } from 'src/app/core/data/access-status-data.service';
import {IdentifierData} from './identifier-data.model';
import {IdentifierDataService} from '../../../core/data/identifier-data.service';

@Component({
  selector: 'ds-identifier-data',
  templateUrl: './identifier-data.component.html'
})
/**
 * Component rendering the access status of an item as a badge
 */
export class IdentifierDataComponent {

  @Input() item: Item;
  identifiers$: Observable<IdentifierData>;

  /**
   * Whether to show the access status badge or not
   */
  showAccessStatus: boolean;

  /**
   * Initialize instance variables
   *
   * @param {IdentifierDataService} identifierDataService
   */
  constructor(private identifierDataService: IdentifierDataService) { }

  ngOnInit(): void {
    if (this.item == null) {
      // Do not show the badge if the feature is inactive or if the item is null.
      return;
    }
    if (this.item.identifiers == null) {
      // In case the access status has not been loaded, do it individually.
      this.item.identifiers = this.identifierDataService.getIdentifierDataFor(this.item);
    }
    this.identifiers$ = this.item.identifiers.pipe(
      map((identifierRD) => {
        if (identifierRD.statusCode !== 401 && hasValue(identifierRD.payload)) {
          return identifierRD.payload;
        } else {
          return null;
        }
      }),
      // EMpty array if none
      //map((identifiers: IdentifierData) => hasValue(identifiers.identifiers) ? identifiers.identifiers : [])
    );
  }
}
