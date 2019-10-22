import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdates } from '../../../../core/data/object-updates/object-updates.reducer';
import { toBitstreamsArray } from '../../../../core/shared/item-bitstreams-utils';
import { switchMap } from 'rxjs/operators';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ds-item-edit-bitstream-bundle',
  styleUrls: ['../item-bitstreams.component.scss'],
  templateUrl: './item-edit-bitstream-bundle.component.html',
})
/**
 * Component that displays a single bundle of an item on the item bitstreams edit page
 */
export class ItemEditBitstreamBundleComponent implements OnInit {

  /**
   * The view on the bundle information and bitstreams
   */
  @ViewChild('bundleView') bundleView;

  /**
   * The bundle to display bitstreams for
   */
  @Input() bundle: Bundle;

  /**
   * The item the bundle belongs to
   */
  @Input() item: Item;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * Event emitter for moving a bitstream within or across bundles
   */
  @Output() moveBitstream: EventEmitter<any> = new EventEmitter();

  /**
   * The updates to the current bundle
   */
  updates$: Observable<FieldUpdates>;

  constructor(private objectUpdatesService: ObjectUpdatesService,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.objectUpdatesService.initialize(this.bundle.self, [], new Date());
    this.updates$ = this.bundle.bitstreams.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.bundle.self, bitstreams))
    );

    this.viewContainerRef.createEmbeddedView(this.bundleView);
  }

  /**
   * A bitstream was moved, emit the event to moveBitstream
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    this.moveBitstream.emit(event);
  }
}
