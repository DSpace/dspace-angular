import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { cloneDeep } from 'lodash';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-item-edit-bitstream]',
  templateUrl: './item-edit-bitstream.component.html',
})
export class ItemEditBitstreamComponent implements OnChanges {
  @Input() fieldUpdate: FieldUpdate;

  @Input() url: string;

  bitstream: Bitstream;

  format$: Observable<BitstreamFormat>;

  constructor(private objectUpdatesService: ObjectUpdatesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.bitstream = cloneDeep(this.fieldUpdate.field) as Bitstream;
    this.format$ = this.bitstream.format.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload()
    );
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.url, this.bitstream);
  }

  /**
   * Cancels the current update for this field in the object updates service
   */
  undo(): void {
    this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.bitstream.uuid);
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
