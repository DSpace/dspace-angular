import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  getRemoteDataPayload
} from '../../../../../core/shared/operators';
import { Item } from '../../../../../core/shared/item.model';
import {
  SearchResultListElementComponent
} from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import {
  WorkflowItemSearchResult
} from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../config/app-config.interface';
import {
  WorkspaceItemSearchResult
} from '../../../../../shared/object-collection/shared/workspace-item-search-result.model';
import { SupervisionOrder } from '../../../../../core/supervision-order/models/supervision-order.model';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { ConfirmationModalComponent } from '../../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../../../../shared/empty.util';
import {
  SupervisionOrderListEntry
} from '../../../../../shared/object-list/supervision-order-status/supervision-order-status.component';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-search-result-admin-workflow-list-element',
  styleUrls: ['./workflow-item-search-result-admin-workflow-list-element.component.scss'],
  templateUrl: './workflow-item-search-result-admin-workflow-list-element.component.html'
})
/**
 * The component for displaying a list element for a workflow item on the admin workflow search page
 */
export class WorkflowItemSearchResultAdminWorkflowListElementComponent extends SearchResultListElementComponent<WorkflowItemSearchResult, WorkflowItem> implements OnInit {

  /**
   * The item linked to the workflow item
   */
  public item$: Observable<Item>;

  /**
   * The id of the item linked to the workflow item
   */
  public itemId: string;

  /**
   * The supervision orders linked to the workflow item
   */
  public supervisionOrder$: BehaviorSubject<SupervisionOrder[]> = new BehaviorSubject<SupervisionOrder[]>([]);

  private messagePrefix = 'workflow-item.search.result';

  constructor(private linkService: LinkService,
              protected dsoNameService: DSONameService,
              protected modalService: NgbModal,
              protected notificationsService: NotificationsService,
              protected supervisionOrderDataService: SupervisionOrderDataService,
              protected translateService: TranslateService,
              protected truncatableService: TruncatableService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize the item object from the workflow item
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('item'));
    this.item$ = (this.dso.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());

    this.item$.pipe(
      take(1),
      tap((item: Item) => this.itemId = item.id),
      mergeMap((item: Item) => this.retrieveSupervisorOrders(item.id))
    ).subscribe((supervisionOrderList: SupervisionOrder[]) => {
      this.supervisionOrder$.next(supervisionOrderList);
    })
  }

  /**
   * Deletes the Group from the Repository. The Group will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  deleteSupervisionOrder(supervisionOrderEntry: SupervisionOrderListEntry) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.dso = supervisionOrderEntry.group;
    modalRef.componentInstance.headerLabel = this.messagePrefix + '.delete-supervision.modal.header';
    modalRef.componentInstance.infoLabel = this.messagePrefix + '.delete-supervision.modal.info';
    modalRef.componentInstance.cancelLabel = this.messagePrefix + '.delete-supervision.modal.cancel';
    modalRef.componentInstance.confirmLabel = this.messagePrefix + '.delete-supervision.modal.confirm';
    modalRef.componentInstance.brandColor = 'danger';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';
    modalRef.componentInstance.response.pipe(
      take(1),
      mergeMap((confirm: boolean) => {
        if (confirm && hasValue(supervisionOrderEntry.supervisionOrder.id)) {
          return this.supervisionOrderDataService.delete(supervisionOrderEntry.supervisionOrder.id).pipe(
            take(1),
            tap((result: boolean) => {
              if (result) {
                this.notificationsService.success(
                  null,
                  this.translateService.get(
                    this.messagePrefix + '.notification.deleted.success',
                    { name: this.dsoNameService.getName(supervisionOrderEntry.group) }
                  )
                );
              } else {
                this.notificationsService.error(
                  null,
                  this.translateService.get(
                    this.messagePrefix + '.notification.deleted.failure',
                    { name: this.dsoNameService.getName(supervisionOrderEntry.group) }
                  )
                );
              }
            }),
            mergeMap((result: boolean) => result ? this.retrieveSupervisorOrders(this.itemId) : this.supervisionOrder$.asObservable())
          )
        } else {
          return this.supervisionOrder$.asObservable()
        }
      })
    ).subscribe((supervisionOrderList: SupervisionOrder[]) => {
      this.supervisionOrder$.next(supervisionOrderList)
    })
  }

  /**
   * Retrieve the list of SupervisionOrder object related to the given item
   *
   * @param itemId
   * @private
   */
  private retrieveSupervisorOrders(itemId): Observable<SupervisionOrder[]> {
    return this.supervisionOrderDataService.searchByItem(
      itemId, false, true, followLink('group')
    ).pipe(
      getFirstCompletedRemoteData(),
      map((soRD: RemoteData<PaginatedList<SupervisionOrder>>) => soRD.hasSucceeded && !soRD.hasNoContent ? soRD.payload.page : [])
    );
  }
}
