import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  Scroll,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { ComcolMetadataComponent } from '../../../shared/comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { VarDirective } from '../../../shared/utils/var.directive';
import { CollectionStylesFormComponent } from '../../collection-form/collection-form.styles';

/**
 * Component for editing a collection's metadata
 */
@Component({
  selector: 'ds-collection-styles',
  templateUrl: './collection-styles.component.html',
  imports: [
    CollectionStylesFormComponent,
    RouterLink,
    AsyncPipe,
    TranslateModule,
    NgIf,
    VarDirective,
  ],
  standalone: true,
})
export class CollectionStylesComponent extends ComcolMetadataComponent<Collection> implements OnInit {
  protected frontendURL = '/collections/';
  protected type = Collection.type;

  /**
   * The collection's item template
   */
  itemTemplateRD$: Observable<RemoteData<Item>>;

  public constructor(
    protected collectionDataService: CollectionDataService,
    protected itemTemplateService: ItemTemplateDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected requestService: RequestService,
    protected chd: ChangeDetectorRef,
  ) {
    super(collectionDataService, router, route, notificationsService, translate);
  }

  /**
   * Cheking if the navigation is done and if so, initialize the collection's item template,
   * to ensure that the item template is always up to date.
   * Check when a NavigationEnd event (URL change) or a Scroll event followed by a NavigationEnd event (refresh event), occurs
   */
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd ||
        (event instanceof Scroll && event.routerEvent instanceof NavigationEnd)
      ) {
        super.ngOnInit();
        this.initTemplateItem();
        this.chd.detectChanges();
      }
    });
  }

  /**
   * Initialize the collection's item template
   */
  initTemplateItem() {
    this.itemTemplateRD$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid)),
    );
  }
}
