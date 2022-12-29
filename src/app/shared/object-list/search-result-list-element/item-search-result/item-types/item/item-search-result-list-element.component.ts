import { Component, Inject } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { SupervisionOrderDataService } from '../../../../../../core/supervision-order/supervision-order-data.service';
import { TruncatableService } from '../../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { AppConfig, APP_CONFIG } from '../../../../../../../config/app-config.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, map, Observable, switchMap, take } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../../../../../shared/empty.util';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { followLink } from '../../../../../../shared/utils/follow-link-config.model';
import { getAllSucceededRemoteListPayload, getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { SupervisionOrder } from '../../../../../../core/supervision-order/models/supervision-order.model';
import { Group } from '../../../../../../core/eperson/models/group.model';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  messagePrefix = 'item.search.result';

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  /**
   * List of the supervision orders combined with the group
   */
  supervisionOrder$: Observable<{ supervisionOrder: SupervisionOrder; group: Group; }[]>;

  constructor(
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected supervisionOrderDataService: SupervisionOrderDataService,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
  ) { super(truncatableService, dsoNameService, appConfig); }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.supervisionOrder$ = this.supervisionOrderDataService.searchByItem(this.dso.uuid, null, null, followLink('group')).pipe(
      getAllSucceededRemoteListPayload(),
      switchMap((supervisionOrders: SupervisionOrder[]) => {
        const supervisionOrdersArray = supervisionOrders.map((supervisionOrder: SupervisionOrder) => {
          return supervisionOrder.group.pipe(
            getFirstSucceededRemoteDataPayload(),
            map((group: Group) => ({ supervisionOrder, group }))
          );
        });
        return combineLatest(supervisionOrdersArray);
      })
    );
  }

  /**
   * Deletes the Group from the Repository. The Group will be the only that this form is showing.
   * It'll either show a success or error message depending on whether the delete was successful or not.
   */
  deleteSupervisionOrder(supervisionOrder) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.dso = supervisionOrder.group;
    modalRef.componentInstance.headerLabel = this.messagePrefix + '.delete-supervision.modal.header';
    modalRef.componentInstance.infoLabel = this.messagePrefix + '.delete-supervision.modal.info';
    modalRef.componentInstance.cancelLabel = this.messagePrefix + '.delete-supervision.modal.cancel';
    modalRef.componentInstance.confirmLabel = this.messagePrefix + '.delete-supervision.modal.confirm';
    modalRef.componentInstance.brandColor = 'danger';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';
    modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
      if (confirm) {
        if (hasValue(supervisionOrder.supervisionOrder.id)) {
          this.supervisionOrderDataService.delete(supervisionOrder.supervisionOrder.id)
            .subscribe((rd: boolean) => {
              if (rd) {
                this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.deleted.success', { name: supervisionOrder.group._name }));
              } else {
                this.notificationsService.error(
                  this.translateService.get(this.messagePrefix + '.notification.deleted.failure.title', { name: supervisionOrder.group._name }),
                  this.translateService.get(this.messagePrefix + '.notification.deleted.failure.content'));
              }
            });
        }
      }
    });
  }
}
