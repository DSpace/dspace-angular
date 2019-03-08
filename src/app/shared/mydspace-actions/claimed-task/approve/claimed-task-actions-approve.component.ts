import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-claimed-task-actions-approve',
  styleUrls: ['./claimed-task-actions-approve.component.scss'],
  templateUrl: './claimed-task-actions-approve.component.html',
})

export class ClaimedTaskActionsApproveComponent {
  @Input() processingApprove: boolean;
  @Input() taskId: string;
  @Input() wrapperClass: string;

  @Output() approve: EventEmitter<any> = new EventEmitter<any>();

  click() {
    this.approve.emit();
  }
}
