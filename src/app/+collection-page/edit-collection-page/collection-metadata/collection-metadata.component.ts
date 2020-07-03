import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { Collection } from '../../../core/shared/collection.model';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { switchMap, take } from 'rxjs/operators';
import { combineLatest as combineLatestObservable } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';

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
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid))
    );
  }

  /**
   * Add a new item template to the collection and redirect to the item template edit page
   */
  addItemTemplate() {
    const collection$ = this.dsoRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    );
    const template$ = collection$.pipe(
      switchMap((collection: Collection) => this.itemTemplateService.create(new Item(), collection.uuid)),
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    );

    combineLatestObservable(collection$, template$).subscribe(([collection, template]) => {
      this.router.navigate(['collections', collection.uuid, 'itemtemplate']);
    });
  }

  /**
   * Delete the item template from the collection
   */
  deleteItemTemplate() {
    const collection$ = this.dsoRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    );
    const template$ = collection$.pipe(
      switchMap((collection: Collection) => this.itemTemplateService.findByCollectionID(collection.uuid)),
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    );

    combineLatestObservable(collection$, template$).pipe(
      switchMap(([collection, template]) => {
        const success$ = this.itemTemplateService.deleteByCollectionID(template, collection.uuid);
        this.objectCache.remove(template.self);
        this.requestService.removeByHrefSubstring(collection.self);
        return success$;
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
