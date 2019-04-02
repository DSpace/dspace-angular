import { Component, Inject, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { distinctUntilChanged, filter, first, flatMap, map, startWith, switchMap, tap } from 'rxjs/operators';
import { zip as observableZip } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { hasValue, hasValueOperator } from '../../../shared/empty.util';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import {
  compareArraysUsingIds,
  filterRelationsByTypeLabel,
  relationsToItems
} from '../../simple/item-types/shared/item.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
})
export class ItemRelationshipsComponent implements OnInit {

  /**
   * The item to display the edit page for
   */
  item: Item;
  /**
   * The current values and updates for all this item's metadata fields
   */
  updates$: Observable<FieldUpdates>;
  /**
   * The current url of this page
   */
  url: string;
  /**
   * Prefix for this component's notification translate keys
   */
  private notificationsPrefix = 'item.edit.metadata.notifications.';

  /**
   * The labels of all different relations within this item
   */
  relationLabels$: Observable<string[]>;

  /**
   * Resolved relationships and types together in one observable
   */
  resolvedRelsAndTypes$: Observable<[Relationship[], RelationshipType[]]>;
  /**
   * The time span for being able to undo discarding changes
   */
  private discardTimeOut: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private objectUpdatesService: ObjectUpdatesService,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService) {
  }

  ngOnInit(): void {
    this.route.parent.data.pipe(map((data) => data.item))
      .pipe(
        first(),
        map((data: RemoteData<Item>) => data.payload)
      ).subscribe((item: Item) => {
      this.item = item;
    });
    this.discardTimeOut = this.EnvConfig.item.edit.undoTimeout;
    this.url = this.router.url;
    if (this.url.indexOf('?') > 0) {
      this.url = this.url.substr(0, this.url.indexOf('?'));
    }
    this.hasChanges().pipe(first()).subscribe((hasChanges) => {
      if (!hasChanges) {
        this.initializeOriginalFields();
      } else {
        this.checkLastModified();
      }
    });
    this.updates$ = this.getRelationships().pipe(
      relationsToItems(this.item.id, this.itemDataService),
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdates(this.url, items))
    );
    this.initRelationshipObservables();
  }

  initRelationshipObservables() {
    const relationships$ = this.getRelationships();

    const relationshipTypes$ = relationships$.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(...rels.map((rel: Relationship) => rel.relationshipType)).pipe(
          map(([...arr]: Array<RemoteData<RelationshipType>>) => arr.map((d: RemoteData<RelationshipType>) => d.payload).filter((type) => hasValue(type)))
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );

    this.resolvedRelsAndTypes$ = observableCombineLatest(
      relationships$,
      relationshipTypes$
    );
    this.relationLabels$ = relationshipTypes$.pipe(
      map((types: RelationshipType[]) => Array.from(new Set(types.map((type) => type.leftLabel))))
    );
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Checks whether or not there are currently updates for this item
   */
  hasChanges(): Observable<boolean> {
    return this.objectUpdatesService.hasUpdates(this.url);
  }

  /**
   * Checks whether or not the item is currently reinstatable
   */
  isReinstatable(): Observable<boolean> {
    return this.objectUpdatesService.isReinstatable(this.url);
  }

  discard(): void {
    const undoNotification = this.notificationsService.info(this.getNotificationTitle('discarded'), this.getNotificationContent('discarded'), { timeOut: this.discardTimeOut });
    this.objectUpdatesService.discardFieldUpdates(this.url, undoNotification);
  }

  /**
   * Request the object updates service to undo discarding all changes to this item
   */
  reinstate() {
    this.objectUpdatesService.reinstateFieldUpdates(this.url);
  }

  submit(): void {
    const updatedItems$ = this.getRelationships().pipe(
      first(),
      relationsToItems(this.item.id, this.itemDataService),
      switchMap((items: Item[]) => this.objectUpdatesService.getUpdatedFields(this.url, items) as Observable<Item[]>)
    );
    // TODO: Delete relationships
  }

  private initializeOriginalFields() {
    this.getRelationships().pipe(
      first(),
      relationsToItems(this.item.id, this.itemDataService)
    ).subscribe((items: Item[]) => {
      this.objectUpdatesService.initialize(this.url, items, this.item.lastModified);
    });
  }

  /**
   * Checks if the current item is still in sync with the version in the store
   * If it's not, a notification is shown and the changes are removed
   */
  private checkLastModified() {
    const currentVersion = this.item.lastModified;
    this.objectUpdatesService.getLastModified(this.url).pipe(first()).subscribe(
      (updateVersion: Date) => {
        if (updateVersion.getDate() !== currentVersion.getDate()) {
          this.notificationsService.warning(this.getNotificationTitle('outdated'), this.getNotificationContent('outdated'));
          this.initializeOriginalFields();
        }
      }
    );
  }

  public getRelationships(): Observable<Relationship[]> {
    return this.item.relationships.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((rels: PaginatedList<Relationship>) => rels.page),
      hasValueOperator(),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  public getRelatedItemsByLabel(label: string): Observable<Item[]> {
    return this.resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel(label),
      relationsToItems(this.item.id, this.itemDataService)
    );
  }

  public getUpdatesByLabel(label: string): Observable<FieldUpdates> {
    return this.getRelatedItemsByLabel(label).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, items))
    )
  }

  /**
   * Get translated notification title
   * @param key
   */
  private getNotificationTitle(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.title');
  }

  /**
   * Get translated notification content
   * @param key
   */
  private getNotificationContent(key: string) {
    return this.translateService.instant(this.notificationsPrefix + key + '.content');

  }

}
