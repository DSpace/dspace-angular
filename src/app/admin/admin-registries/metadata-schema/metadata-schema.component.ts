import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
  zip,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { MetadataField } from '../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { RegistryService } from '../../../core/registry/registry.service';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { toFindListOptions } from '../../../shared/pagination/pagination.utils';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../../shared/utils/var.directive';
import { MetadataFieldFormComponent } from './metadata-field-form/metadata-field-form.component';

@Component({
  selector: 'ds-metadata-schema',
  templateUrl: './metadata-schema.component.html',
  styleUrls: ['./metadata-schema.component.scss'],
  imports: [
    AsyncPipe,
    MetadataFieldFormComponent,
    NgClass,
    PaginationComponent,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * A component used for managing all existing metadata fields within the current metadata schema.
 * The admin can create, edit or delete metadata fields here.
 */
export class MetadataSchemaComponent implements OnDestroy, OnInit {
  /**
   * The metadata schema
   */
  metadataSchema$: Observable<MetadataSchema>;

  /**
   * A list of all the fields attached to this metadata schema
   */
  metadataFields$: Observable<RemoteData<PaginatedList<MetadataField>>>;

  /**
   * Pagination config used to display the list of metadata fields
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'rm',
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 200],
  });

  /**
   * Whether or not the list of MetadataFields needs an update
   */
  needsUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * The current {@link MetadataField} that is being edited
   */
  activeField$: Observable<MetadataField>;

  /**
   * The selected {@link MetadataField} IDs
   */
  selectedMetadataFieldIDs$: Observable<number[]>;

  subscriptions: Subscription[] = [];

  constructor(
    protected registryService: RegistryService,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected paginationService: PaginationService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.metadataSchema$ = this.registryService.getMetadataSchemaByPrefix(this.route.snapshot.params.schemaName).pipe(getFirstSucceededRemoteDataPayload());
    this.activeField$ = this.registryService.getActiveMetadataField();
    this.selectedMetadataFieldIDs$ = this.registryService.getSelectedMetadataFields().pipe(
      map((metadataFields: MetadataField[]) => metadataFields.map((metadataField: MetadataField) => metadataField.id)),
    );
    this.updateFields();
  }

  /**
   * Update the list of fields by fetching it from the rest api or cache
   */
  private updateFields() {
    this.metadataFields$ = this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      switchMap((currentPagination) => combineLatest([this.metadataSchema$, this.needsUpdate$, of(currentPagination)])),
      switchMap(([schema, update, currentPagination]: [MetadataSchema, boolean, PaginationComponentOptions]) => {
        if (update) {
          this.needsUpdate$.next(false);
        }
        return this.registryService.getMetadataFieldsBySchema(schema, toFindListOptions(currentPagination), !update, true);
      }),
    );
  }

  /**
   * Force-update the list of fields by first clearing the cache related to metadata fields, then performing
   * a new REST call
   */
  public forceUpdateFields() {
    this.registryService.clearMetadataFieldRequests();
    this.needsUpdate$.next(true);
  }

  /**
   * Start editing the selected metadata field
   * @param field
   */
  editField(field: MetadataField) {
    this.subscriptions.push(this.activeField$.pipe(take(1)).subscribe((activeField) => {
      if (field === activeField) {
        this.registryService.cancelEditMetadataField();
      } else {
        this.registryService.editMetadataField(field);
      }
    }));
  }

  /**
   * Select a metadata field within the list (checkbox)
   * @param field
   * @param event
   */
  selectMetadataField(field: MetadataField, event) {
    event.target.checked ?
      this.registryService.selectMetadataField(field) :
      this.registryService.deselectMetadataField(field);
  }

  /**
   * Delete all the selected metadata fields
   */
  deleteFields() {
    this.subscriptions.push(this.selectedMetadataFieldIDs$.pipe(
      take(1),
      switchMap((fieldIDs) => zip(fieldIDs.map((fieldID) => this.registryService.deleteMetadataField(fieldID).pipe(getFirstCompletedRemoteData())))),
    ).subscribe((responses: RemoteData<NoContent>[]) => {
      const successResponses = responses.filter((response: RemoteData<NoContent>) => response.hasSucceeded);
      const failedResponses = responses.filter((response: RemoteData<NoContent>) => response.hasFailed);
      if (successResponses.length > 0) {
        this.showNotification(true, successResponses.length);
      }
      if (failedResponses.length > 0) {
        this.showNotification(false, failedResponses.length);
      }
      this.registryService.deselectAllMetadataField();
      this.registryService.cancelEditMetadataField();
    }));
  }

  /**
   * Show notifications for an amount of deleted metadata fields
   * @param success   Whether or not the notification should be a success message (error message when false)
   * @param amount    The amount of deleted metadata fields
   */
  showNotification(success: boolean, amount: number) {
    const prefix = 'admin.registries.schema.notification';
    const suffix = success ? 'success' : 'failure';
    const head = this.translateService.instant(success ? `${prefix}.${suffix}` : `${prefix}.${suffix}`);
    const content = this.translateService.instant(`${prefix}.field.deleted.${suffix}`, { amount: amount });
    if (success) {
      this.notificationsService.success(head, content);
    } else {
      this.notificationsService.error(head, content);
    }
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config.id);
    this.registryService.deselectAllMetadataField();
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
