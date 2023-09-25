import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { hasValue } from '../../../../empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ds-status-badge',
    templateUrl: './status-badge.component.html',
    standalone: true,
    imports: [NgIf, TranslateModule]
})
/**
 * Component rendering the status of an item as a badge
 */
export class StatusBadgeComponent implements OnInit {

  /**
   * The component used to retrieve the status from
   */
  @Input() object: DSpaceObject;

  /**
   * Whether or not the "Private" badge should be displayed for this listable object
   */
  privateBadge = false;

  /**
   * Whether or not the "Withdrawn" badge should be displayed for this listable object
   */
  withdrawnBadge = false;

  /**
   * Initialize which badges should be visible
   */
  ngOnInit(): void {
    let objectAsAny = this.object as any;
    if (hasValue(objectAsAny.indexableObject)) {
      objectAsAny = objectAsAny.indexableObject;
    }
    const objectExists = hasValue(objectAsAny);
    this.privateBadge = objectExists && hasValue(objectAsAny.isDiscoverable) && !objectAsAny.isDiscoverable;
    this.withdrawnBadge = objectExists && hasValue(objectAsAny.isWithdrawn) && objectAsAny.isWithdrawn;
  }
}
