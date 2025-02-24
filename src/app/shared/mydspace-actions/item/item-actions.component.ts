import {
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import {
  Item,
  ItemDataService,
  NotificationsService,
  RequestService,
  SearchService,
} from '@dspace/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { MyDSpaceActionsComponent } from '../mydspace-actions';

/**
 * This component represents mydspace actions related to Item object.
 */
@Component({
  selector: 'ds-item-actions',
  styleUrls: ['./item-actions.component.scss'],
  templateUrl: './item-actions.component.html',
  standalone: true,
  imports: [NgbTooltipModule, RouterLink, TranslateModule],
})

export class ItemActionsComponent extends MyDSpaceActionsComponent<Item, ItemDataService> implements OnInit {

  /**
   * The Item object
   */
  @Input() object: Item;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   */
  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
    super(Item.type, injector, router, notificationsService, translate, searchService, requestService);
  }

  ngOnInit(): void {
    this.initPageRoute();
  }

  /**
   * Init the target object
   *
   * @param {Item} object
   */
  initObjects(object: Item) {
    this.object = object;
    this.initPageRoute();
  }

  /**
   * Initialise the route to the item's page
   */
  initPageRoute() {
    this.itemPageRoute = getItemPageRoute(this.object);
  }

}
