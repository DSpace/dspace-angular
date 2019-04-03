import { Component, Inject } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { RelationshipService } from '../../../core/data/relationship.service';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
})
/**
 * Component for displaying an item's relationships edit page
 */
export class ItemRelationshipsComponent extends AbstractItemUpdateComponent {

  /**
   * The labels of all different relations within this item
   */
  relationLabels$: Observable<string[]>;

  constructor(
    protected itemService: ItemDataService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected route: ActivatedRoute,
    protected relationshipService: RelationshipService
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.relationLabels$ = this.relationshipService.getItemRelationshipLabels(this.item);
  }

  /**
   * Initialize the values and updates of the current item's relationship fields
   */
  public initializeUpdates(): void {
    this.updates$ = this.relationshipService.getRelatedItems(this.item).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdates(this.url, items))
    );
  }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.relationships.notifications.';
  }

  public submit(): void {
    const updatedItems$ = this.relationshipService.getRelatedItems(this.item).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getUpdatedFields(this.url, items) as Observable<Item[]>)
    );
    // TODO: Delete relationships
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    this.relationshipService.getRelatedItems(this.item).pipe(take(1)).subscribe((items: Item[]) => {
      this.objectUpdatesService.initialize(this.url, items, this.item.lastModified);
    });
  }

  /**
   * Transform the item's relationships of a specific type into related items
   * @param label   The relationship type's label
   */
  public getRelatedItemsByLabel(label: string): Observable<Item[]> {
    return this.relationshipService.getRelatedItemsByLabel(this.item, label);
  }

  /**
   * Get FieldUpdates for the relationships of a specific type
   * @param label   The relationship type's label
   */
  public getUpdatesByLabel(label: string): Observable<FieldUpdates> {
    return this.getRelatedItemsByLabel(label).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, items))
    )
  }

  /**
   * Get the i18n message key for a relationship
   * @param label   The relationship type's label
   */
  public getRelationshipMessageKey(label: string): string {
    if (label.indexOf('Of') > -1) {
      return `relationships.${label.substring(0, label.indexOf('Of') + 2)}`
    } else {
      return label;
    }
  }

}
