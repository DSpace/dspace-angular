import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-edit-bitstream-drag-handle',
  styleUrls: ['../item-bitstreams.component.scss'],
  templateUrl: './item-edit-bitstream-drag-handle.component.html',
  imports: [
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component displaying a drag handle for the item-edit-bitstream page
 * Creates an embedded view of the contents
 * (which means it'll be added to the parents html without a wrapping ds-item-edit-bitstream-drag-handle element)
 */
export class ItemEditBitstreamDragHandleComponent implements OnInit, OnDestroy {
  /**
   * The view on the drag-handle
   */
  @ViewChild('handleView', { static: true }) handleView;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.handleView);
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

}
