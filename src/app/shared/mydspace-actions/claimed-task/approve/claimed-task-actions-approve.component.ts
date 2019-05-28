import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-claimed-task-actions-approve',
  styleUrls: ['./claimed-task-actions-approve.component.scss'],
  templateUrl: './claimed-task-actions-approve.component.html',
})

export class ClaimedTaskActionsApproveComponent {

  /**
   * A boolean representing if a reject operation is pending
   */
  @Input() processingApprove: boolean;

  /**
   * CSS classes to append to reject button
   */
  @Input() wrapperClass: string;

  /**
   * An event fired when a approve action is confirmed.
   */
  @Output() approve: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emit approve event
   */
  confirmApprove() {
    this.approve.emit();
  }
}
