import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { SupervisionGroupSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/supervision-group-selector/supervision-group-selector.component';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import {
    getWorkflowItemSendBackRoute,
    getWorkflowItemDeleteRoute
} from '../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';

@Component({
  selector: 'ds-workflow-item-admin-workflow-actions-element',
  styleUrls: ['./workflow-item-admin-workflow-actions.component.scss'],
  templateUrl: './workflow-item-admin-workflow-actions.component.html'
})
/**
 * The component for displaying the actions for a list element for an item on the admin workflow search page
 */
export class WorkflowItemAdminWorkflowActionsComponent {

  /**
   * The workflow item to perform the actions on
   */
  @Input() public wfi: WorkflowItem;

  /**
   * Whether or not to use small buttons
   */
  @Input() public small: boolean;

  constructor(
    private modalService: NgbModal
  ) { }

  /**
   * Returns the path to the delete page of this workflow item
   */
  getDeleteRoute(): string {

    return getWorkflowItemDeleteRoute(this.wfi.id);
  }

  /**
   * Returns the path to the send back page of this workflow item
   */
  getSendBackRoute(): string {
    return getWorkflowItemSendBackRoute(this.wfi.id);
  }

  /**
   * Returns the path to the to administrative edit page policies tab
   */
  getPoliciesRoute(): Observable<string> {
    return this.wfi.item.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => {
        return '/items/' + item.uuid + '/edit/bitstreams';
      })
    );
  }

  /**
   * Opens the Supervision Modal to create a supervision order
   */
  openSupervisionModal() {
    this.wfi.item.pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((item: Item) => {
      const supervisionModal = this.modalService.open(SupervisionGroupSelectorComponent, { size: 'lg', backdrop: 'static' });
      supervisionModal.componentInstance.itemUUID = item.uuid;
    });
  }
}
