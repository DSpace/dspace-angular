import { Component, OnInit } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Observable } from 'rxjs';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent(WorkflowItem, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-admin-workflow-list-element',
  styleUrls: ['./workflow-item-admin-workflow-list-element.component.scss'],
  templateUrl: './workflow-item-admin-workflow-list-element.component.html'
})
/**
 * The component for displaying a list element for an workflow item on the admin workflow search page
 */
export class WorkflowItemAdminWorkflowListElementComponent extends AbstractListableElementComponent<WorkflowItem> implements OnInit {

  /**
   * The item linked to the workflow item
   */
  public item$: Observable<Item>;

  constructor(private linkService: LinkService) {
    super();
  }

  /**
   * Initialize the item object from the workflow item
   */
  ngOnInit(): void {
    this.object = this.linkService.resolveLink(this.object, followLink('item'));
    this.item$ = (this.object.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
