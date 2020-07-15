import { Component, OnInit } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { MetadataField } from '../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { toFindListOptions } from '../../../shared/pagination/pagination.utils';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { followLink } from '../../../shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-metadata-schema',
  templateUrl: './metadata-schema.component.html',
  styleUrls: ['./metadata-schema.component.scss']
})
/**
 * A component used for managing all existing metadata fields within the current metadata schema.
 * The admin can create, edit or delete metadata fields here.
 */
export class MetadataSchemaComponent implements OnInit {
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
    id: 'registry-metadatafields-pagination',
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 200]
  });

  /**
   * Whether or not the list of MetadataFields needs an update
   */
  needsUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private registryService: RegistryService,
              private route: ActivatedRoute,
              private notificationsService: NotificationsService,
              private router: Router,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initialize(params);
    });
  }

  /**
   * Initialize the component using the params within the url (schemaName)
   * @param params
   */
  initialize(params) {
    this.metadataSchema$ = this.registryService.getMetadataSchemaByPrefix(params.schemaName).pipe(getFirstSucceededRemoteDataPayload());
    this.updateFields();
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.config.currentPage = event;
    this.forceUpdateFields();
  }

  /**
   * Update the list of fields by fetching it from the rest api or cache
   */
  private updateFields() {
    this.metadataFields$ = combineLatest(this.metadataSchema$, this.needsUpdate$).pipe(
      switchMap(([schema, update]: [MetadataSchema, boolean]) => {
        if (update) {
          return this.registryService.getMetadataFieldsBySchema(schema, toFindListOptions(this.config), followLink('schema'));
        }
      })
    );
  }

  /**
   * Force-update the list of fields by first clearing the cache related to metadata fields, then performing
   * a new REST call
   */
  public forceUpdateFields() {
    this.needsUpdate$.next(true);
  }

  /**
   * Start editing the selected metadata field
   * @param field
   */
  editField(field: MetadataField) {
    this.getActiveField().pipe(take(1)).subscribe((activeField) => {
      if (field === activeField) {
        this.registryService.cancelEditMetadataField();
      } else {
        this.registryService.editMetadataField(field);
      }
    });
  }

  /**
   * Checks whether the given metadata field is active (being edited)
   * @param field
   */
  isActive(field: MetadataField): Observable<boolean> {
    return this.getActiveField().pipe(
      map((activeField) => field === activeField)
    );
  }

  /**
   * Gets the active metadata field (being edited)
   */
  getActiveField(): Observable<MetadataField> {
    return this.registryService.getActiveMetadataField();
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
   * Checks whether a given metadata field is selected in the list (checkbox)
   * @param field
   */
  isSelected(field: MetadataField): Observable<boolean> {
    return this.registryService.getSelectedMetadataFields().pipe(
      map((fields) => fields.find((selectedField) => selectedField === field) != null)
    );
  }

  /**
   * Delete all the selected metadata fields
   */
  deleteFields() {
    this.registryService.clearMetadataFieldRequests().subscribe();
    this.registryService.getSelectedMetadataFields().pipe(take(1)).subscribe(
      (fields) => {
        const tasks$ = [];
        for (const field of fields) {
          if (hasValue(field.id)) {
            tasks$.push(this.registryService.deleteMetadataField(field.id));
          }
        }
        zip(...tasks$).subscribe((responses: RestResponse[]) => {
          const successResponses = responses.filter((response: RestResponse) => response.isSuccessful);
          const failedResponses = responses.filter((response: RestResponse) => !response.isSuccessful);
          if (successResponses.length > 0) {
            this.showNotification(true, successResponses.length);
          }
          if (failedResponses.length > 0) {
            this.showNotification(false, failedResponses.length);
          }
          this.registryService.deselectAllMetadataField();
          this.registryService.cancelEditMetadataField();
          this.forceUpdateFields();
        });
      }
    )
  }

  /**
   * Show notifications for an amount of deleted metadata fields
   * @param success   Whether or not the notification should be a success message (error message when false)
   * @param amount    The amount of deleted metadata fields
   */
  showNotification(success: boolean, amount: number) {
    const prefix = 'admin.registries.schema.notification';
    const suffix = success ? 'success' : 'failure';
    const messages = observableCombineLatest(
      this.translateService.get(success ? `${prefix}.${suffix}` : `${prefix}.${suffix}`),
      this.translateService.get(`${prefix}.field.deleted.${suffix}`, { amount: amount })
    );
    messages.subscribe(([head, content]) => {
      if (success) {
        this.notificationsService.success(head, content)
      } else {
        this.notificationsService.error(head, content)
      }
    });
  }
}
