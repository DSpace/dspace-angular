import { Component, Inject } from '@angular/core';
import {
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  ItemSearchResultListElementComponent
} from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../config/app-config.interface';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ResourcePolicyDataService } from '../../../../../core/resource-policy/resource-policy-data.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-person-search-result-list-element',
  styleUrls: ['./person-search-result-list-element.component.scss'],
  templateUrl: './person-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  public constructor(
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
  ) {
    super(truncatableService, dsoNameService, appConfig, supervisionOrderDataService, modalService, notificationsService, translateService, resourcePolicyService, authService, epersonService, authorizationService);
  }

  /**
   * Display thumbnail if required by configuration
   */
  showThumbnails: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }
}
