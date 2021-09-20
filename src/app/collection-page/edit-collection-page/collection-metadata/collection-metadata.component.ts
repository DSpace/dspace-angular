import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { Collection } from '../../../core/shared/collection.model';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { combineLatest as combineLatestObservable, Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { switchMap, tap } from 'rxjs/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { getCollectionItemTemplateRoute } from '../../collection-page-routing-paths';

/**
 * Component for editing a collection's metadata
 */
@Component({
  selector: 'ds-collection-metadata',
  templateUrl: './collection-metadata.component.html',
})
export class CollectionMetadataComponent extends ComcolMetadataComponent<Collection> {
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
    protected objectCache: ObjectCacheService,
    protected requestService: RequestService
  ) {
    super(collectionDataService, router, route, notificationsService, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initTemplateItem();
  }

  /**
   * Initialize the collection's item template
   */
  initTemplateItem() {
    this.itemTemplateRD$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid))
    );
  }

  /**
   * Add a new item template to the collection and redirect to the item template edit page
   */
  addItemTemplate() {
    const collection$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
    );
    const template$ = collection$.pipe(
      switchMap((collection: Collection) => this.itemTemplateService.create(new Item(), collection.uuid).pipe(
        getFirstSucceededRemoteDataPayload(),
      )),
    );
    const templateHref$ = collection$.pipe(
      switchMap((collection) => this.itemTemplateService.getCollectionEndpoint(collection.id)),
    );

    combineLatestObservable(collection$, template$, templateHref$).subscribe(([collection, template, templateHref]) => {
      this.requestService.setStaleByHrefSubstring(templateHref);
      this.router.navigate([getCollectionItemTemplateRoute(collection.uuid)]);
    });
  }

  /**
   * Delete the item template from the collection
   */
  deleteItemTemplate() {
    const collection$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
    );
    const template$ = collection$.pipe(
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid).pipe(
        getFirstSucceededRemoteDataPayload(),
      )),
    );
    const templateHref$ = collection$.pipe(
      switchMap((collection) => this.itemTemplateService.getCollectionEndpoint(collection.id)),
    );

    combineLatestObservable(collection$, template$, templateHref$).pipe(
      switchMap(([collection, template, templateHref]) => {
        return this.itemTemplateService.deleteByCollectionID(template, collection.uuid).pipe(
          tap((success: boolean) => {
            if (success) {
              this.objectCache.remove(templateHref);
              this.objectCache.remove(template.self);
              this.requestService.setStaleByHrefSubstring(template.self);
              this.requestService.setStaleByHrefSubstring(templateHref);
              this.requestService.setStaleByHrefSubstring(collection.self);
            }
          })
        );
      })
    ).subscribe((success: boolean) => {
      if (success) {
        this.notificationsService.success(null, this.translate.get('collection.edit.template.notifications.delete.success'));
      } else {
        this.notificationsService.error(null, this.translate.get('collection.edit.template.notifications.delete.error'));
      }
      this.initTemplateItem();
    });
  }
}
