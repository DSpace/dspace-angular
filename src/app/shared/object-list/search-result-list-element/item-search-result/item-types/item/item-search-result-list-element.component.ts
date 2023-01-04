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
import { combineLatest, filter, map, Observable, switchMap, take } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../../../../../shared/empty.util';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { followLink } from '../../../../../../shared/utils/follow-link-config.model';
import { getAllSucceededRemoteListPayload, getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { SupervisionOrder } from '../../../../../../core/supervision-order/models/supervision-order.model';
import { Group } from '../../../../../../core/eperson/models/group.model';
import { ResourcePolicyDataService } from '../../../../../../core/resource-policy/resource-policy-data.service';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../../core/shared/operators';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { EPerson } from '../../../../../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../../../../../core/eperson/eperson-data.service';
import { AuthorizationDataService } from '../../../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../../../core/data/feature-authorization/feature-id';

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

  /**
   * The groups the user belongs to
   */
  groups: Group[];

  constructor(
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected supervisionOrderDataService: SupervisionOrderDataService,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected resourcePolicyService: ResourcePolicyDataService,
    protected authService: AuthService,
    protected epersonService: EPersonDataService,
    protected authorizationService: AuthorizationDataService
  ) { super(truncatableService, dsoNameService, appConfig); }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    let isAdmin = false;
    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).subscribe(isadmin => {
      isAdmin = isadmin;
    });

    this.authService.getAuthenticatedUserFromStore().pipe(
      filter((user: EPerson) => hasValue(user.id)),
      switchMap((user: EPerson) => this.epersonService.findById(user.id, true, true, followLink('groups'))),
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((user: EPerson) => user.groups),
    ).subscribe(groups => {
      this.groups = groups?.payload?.page;
    });

    this.itemPageRoute = getItemPageRoute(this.dso);
    if (this.supervisionOrders) {
      this.resourcePolicyService.searchByResource(
        this.dso.uuid, null, false, true,
        followLink('eperson'), followLink('group')
      ).pipe(
        getAllSucceededRemoteData(),
      ).subscribe((result) => {
        this.supervisionOrder$ = this.supervisionOrderDataService.searchByItem(this.dso.uuid, null, null, followLink('group')).pipe(
          getAllSucceededRemoteListPayload(),
          switchMap((supervisionOrders: SupervisionOrder[]) => {
            const supervisionOrdersArray = supervisionOrders.map((supervisionOrder: SupervisionOrder) => {
              return supervisionOrder.group.pipe(
                getFirstSucceededRemoteDataPayload(),
                map((group: Group) => {
                  let isAuthorized = false;
                  result.payload.page.forEach(resourcePolicy => {
                    resourcePolicy.group.subscribe(res => {
                      if (isAdmin || (res.payload && res.payload.uuid === group.uuid && this.groups.find(groups => groups.uuid === group.uuid))) {
                        isAuthorized = true;
                      }
                    });
                  });
                  return isAuthorized ? ({ supervisionOrder, group }) : null;
                }),
              );
            });
            return combineLatest(supervisionOrdersArray).pipe(
              map(array => array.filter(hasValue))
            );
          }));
      });
    }
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
                this.supervisionOrderDataService.searchByItem(this.dso.uuid, null, null, followLink('group'));
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
