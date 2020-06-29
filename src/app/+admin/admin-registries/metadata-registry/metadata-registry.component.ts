import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { toFindListOptions } from '../../../shared/pagination/pagination.utils';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html',
  styleUrls: ['./metadata-registry.component.scss']
})
/**
 * A component used for managing all existing metadata schemas within the repository.
 * The admin can create, edit or delete metadata schemas here.
 */
export class MetadataRegistryComponent {

  /**
   * A list of all the current metadata schemas within the repository
   */
  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;

  /**
   * Pagination config used to display the list of metadata schemas
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-metadataschemas-pagination',
    pageSize: 25
  });

  /**
   * Whether or not the list of MetadataSchemas needs an update
   */
  needsUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private registryService: RegistryService,
              private notificationsService: NotificationsService,
              private router: Router,
              private translateService: TranslateService) {
    this.updateSchemas();
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.config.currentPage = event;
    this.forceUpdateSchemas();
  }

  /**
   * Update the list of schemas by fetching it from the rest api or cache
   */
  private updateSchemas() {
    this.metadataSchemas = this.needsUpdate$.pipe(
      filter((update) => update === true),
      switchMap(() => this.registryService.getMetadataSchemas(toFindListOptions(this.config)))
    );
  }

  /**
   * Force-update the list of schemas by first clearing the cache related to metadata schemas, then performing
   * a new REST call
   */
  public forceUpdateSchemas() {
    this.needsUpdate$.next(true);
  }

  /**
   * Start editing the selected metadata schema
   * @param schema
   */
  editSchema(schema: MetadataSchema) {
    this.getActiveSchema().pipe(take(1)).subscribe((activeSchema) => {
      if (schema === activeSchema) {
        this.registryService.cancelEditMetadataSchema();
      } else {
        this.registryService.editMetadataSchema(schema);
      }
    });
  }

  /**
   * Checks whether the given metadata schema is active (being edited)
   * @param schema
   */
  isActive(schema: MetadataSchema): Observable<boolean> {
    return this.getActiveSchema().pipe(
      map((activeSchema) => schema === activeSchema)
    );
  }

  /**
   * Gets the active metadata schema (being edited)
   */
  getActiveSchema(): Observable<MetadataSchema> {
    return this.registryService.getActiveMetadataSchema();
  }

  /**
   * Select a metadata schema within the list (checkbox)
   * @param schema
   * @param event
   */
  selectMetadataSchema(schema: MetadataSchema, event) {
    event.target.checked ?
      this.registryService.selectMetadataSchema(schema) :
      this.registryService.deselectMetadataSchema(schema);
  }

  /**
   * Checks whether a given metadata schema is selected in the list (checkbox)
   * @param schema
   */
  isSelected(schema: MetadataSchema): Observable<boolean> {
    return this.registryService.getSelectedMetadataSchemas().pipe(
      map((schemas) => schemas.find((selectedSchema) => selectedSchema === schema) != null)
    );
  }

  /**
   * Delete all the selected metadata schemas
   */
  deleteSchemas() {
    this.registryService.clearMetadataSchemaRequests().subscribe();
    this.registryService.getSelectedMetadataSchemas().pipe(take(1)).subscribe(
      (schemas) => {
        const tasks$ = [];
        for (const schema of schemas) {
          if (hasValue(schema.id)) {
            tasks$.push(this.registryService.deleteMetadataSchema(schema.id));
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
          this.registryService.deselectAllMetadataSchema();
          this.registryService.cancelEditMetadataSchema();
          this.forceUpdateSchemas();
        });
      }
    )
  }

  /**
   * Show notifications for an amount of deleted metadata schemas
   * @param success   Whether or not the notification should be a success message (error message when false)
   * @param amount    The amount of deleted metadata schemas
   */
  showNotification(success: boolean, amount: number) {
    const prefix = 'admin.registries.schema.notification';
    const suffix = success ? 'success' : 'failure';
    const messages = observableCombineLatest(
      this.translateService.get(success ? `${prefix}.${suffix}` : `${prefix}.${suffix}`),
      this.translateService.get(`${prefix}.deleted.${suffix}`, { amount: amount })
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
