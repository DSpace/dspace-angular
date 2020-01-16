import { Component, Input, OnChanges } from '@angular/core';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { cloneDeep } from 'lodash';
import { Item } from '../../../../core/shared/item.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-edit-relationship]',
  styleUrls: ['./edit-relationship.component.scss'],
  templateUrl: './edit-relationship.component.html',
})
export class EditRelationshipComponent implements OnChanges {
  /**
   * The current field, value and state of the relationship
   */
  @Input() fieldUpdate: FieldUpdate;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * The related item of this relationship
   */
  item: Item;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.ListElement;

  constructor(private objectUpdatesService: ObjectUpdatesService) {
  }

  /**
   * Sets the current relationship based on the fieldUpdate input field
   */
  ngOnChanges(): void {
    this.item = cloneDeep(this.fieldUpdate.field) as Item;
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.url, this.item);
  }

  /**
   * Cancels the current update for this field in the object updates service
   */
  undo(): void {
    this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.item.uuid);
  }

  /**
   * Check if a user should be allowed to remove this field
   */
  canRemove(): boolean {
    return this.fieldUpdate.changeType !== FieldChangeType.REMOVE;
  }

  /**
   * Check if a user should be allowed to cancel the update to this field
   */
  canUndo(): boolean {
    return this.fieldUpdate.changeType >= 0;
  }
}
