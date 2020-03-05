import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'ds-item-edit-bitstream-drag-handle',
  styleUrls: ['../item-bitstreams.component.scss'],
  templateUrl: './item-edit-bitstream-drag-handle.component.html',
})
export class ItemEditBitstreamDragHandleComponent implements OnInit {
  /**
   * The view on the drag-handle
   */
  @ViewChild('handleView', {static: false}) handleView;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.handleView);
  }

}
