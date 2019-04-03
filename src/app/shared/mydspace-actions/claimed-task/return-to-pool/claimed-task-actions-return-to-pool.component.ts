import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-claimed-task-actions-return-to-pool',
  styleUrls: ['./claimed-task-actions-return-to-pool.component.scss'],
  templateUrl: './claimed-task-actions-return-to-pool.component.html',
})

export class ClaimedTaskActionsReturnToPoolComponent {

  /**
   * A boolean representing if a return to pool operation is pending
   */
  @Input() processingReturnToPool: boolean;

  /**
   * CSS classes to append to return to pool button
   */
  @Input() wrapperClass: string;

  /**
   * An event fired when a return to pool action is confirmed.
   */
  @Output() returnToPool: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit returnToPool event
   */
  confirmReturnToPool() {
    this.returnToPool.emit();
  }
}
