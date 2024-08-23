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
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  catchError,
  map,
  startWith,
} from 'rxjs/operators';

import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';

/**
 * This component represents a badge with correction item information.
 */
@Component({
  selector: 'ds-item-correction',
  styleUrls: ['./item-correction.component.scss'],
  templateUrl: './item-correction.component.html',
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})
export class ItemCorrectionComponent implements OnInit {

  /**
   * The target object
   */
  @Input() item: Item;

  /**
   * A boolean representing if item is a correction of an existing one
   */
  isCorrectionOfItem$: Observable<boolean>;

  constructor(private relationshipService: RelationshipDataService) {
  }
  /**
   * Check if item is a correction of an existing one
   */
  ngOnInit(): void {
    this.isCorrectionOfItem$ =  this.relationshipService.getItemRelationshipsByLabel(
      this.item,
      'isCorrectionOfItem',
    ).pipe(
      getFirstSucceededRemoteListPayload(),
      map((list: Relationship[]) => list.length > 0),
      startWith(false),
      catchError(() => observableOf(false)),
    );
  }
}
