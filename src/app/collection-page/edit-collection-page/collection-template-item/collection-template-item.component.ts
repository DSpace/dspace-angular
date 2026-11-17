import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ItemTemplateDataService } from '@dspace/core/data/item-template-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import { NoContent } from '@dspace/core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { ThemedDsoEditMetadataComponent } from '../../../dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { VarDirective } from '../../../shared/utils/var.directive';

/**
 * Component for managing the item template of a collection
 */
@Component({
  selector: 'ds-collection-template-item',
  templateUrl: './collection-template-item.component.html',
  imports: [
    AsyncPipe,
    ThemedDsoEditMetadataComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class CollectionTemplateItemComponent implements OnInit {
  /**
   * The collection to manage the item template for
   */
  dsoRD$: Observable<RemoteData<Collection>>;

  /**
   * The collection's item template
   */
  itemTemplateRD$: Observable<RemoteData<Item>>;

  /**
   * Whether the user is currently editing the item template
   */
  editing = false;

  public constructor(
    protected itemTemplateService: ItemTemplateDataService,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected requestService: RequestService,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(map((data) => data.dso));
    this.initTemplateItem();
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

  /**
   * Add a new item template to the collection and start editing it
   */
  addItemTemplate() {
    const collection$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
    );
    const template$ = collection$.pipe(
      switchMap((collection: Collection) => this.itemTemplateService.createByCollectionID(new Item(), collection.uuid).pipe(
        getFirstSucceededRemoteDataPayload(),
      )),
    );
    const templateHref$ = collection$.pipe(
      switchMap((collection) => this.itemTemplateService.getCollectionEndpoint(collection.id)),
    );

    combineLatest([collection$, template$, templateHref$]).subscribe(([, , templateHref]) => {
      this.requestService.setStaleByHrefSubstring(templateHref);
      this.editing = true;
      this.initTemplateItem();
    });
  }

  /**
   * Start editing the collection's item template
   */
  editItemTemplate() {
    this.editing = true;
  }

  /**
   * Stop editing the collection's item template
   */
  cancelEdit() {
    this.editing = false;
  }

  /**
   * Delete the item template from the collection
   */
  deleteItemTemplate() {
    this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid)),
      getFirstSucceededRemoteDataPayload(),
      switchMap((template) => {
        return this.itemTemplateService.delete(template.uuid);
      }),
      getFirstCompletedRemoteData(),
      map((response: RemoteData<NoContent>) => hasValue(response) && response.hasSucceeded),
    ).subscribe((success: boolean) => {
      if (success) {
        this.notificationsService.success(null, this.translate.get('collection.edit.template.notifications.delete.success'));
      } else {
        this.notificationsService.error(null, this.translate.get('collection.edit.template.notifications.delete.error'));
      }
      this.editing = false;
      this.initTemplateItem();
    });
  }
}
