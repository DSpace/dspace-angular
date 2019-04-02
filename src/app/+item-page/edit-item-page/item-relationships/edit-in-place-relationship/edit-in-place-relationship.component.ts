import { Component, Input, OnChanges } from '@angular/core';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { cloneDeep } from 'lodash';
import { Item } from '../../../../core/shared/item.model';
import { VIEW_MODE_ELEMENT } from '../../../simple/related-items/related-items-component';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-edit-in-place-relationship]',
  styleUrls: ['./edit-in-place-relationship.component.scss'],
  templateUrl: './edit-in-place-relationship.component.html',
})
export class EditInPlaceRelationshipComponent implements OnChanges {
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
  viewMode = VIEW_MODE_ELEMENT;

  constructor(private objectUpdatesService: ObjectUpdatesService) {
  }

  /**
   * Sets the current relationship based on the fieldUpdate input field
   */
  ngOnChanges(): void {
    this.item = cloneDeep(this.fieldUpdate.field) as Item;
  }

  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.url, this.item);
  }

  undo(): void {
    this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.item.uuid);
  }

  canRemove(): boolean {
    return this.fieldUpdate.changeType !== FieldChangeType.REMOVE;
  }

  canUndo(): boolean {
    return this.fieldUpdate.changeType >= 0;
  }

}
