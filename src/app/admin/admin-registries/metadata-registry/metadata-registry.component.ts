import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  zip,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { RegistryService } from '../../../core/registry/registry.service';
import { NoContent } from '../../../core/shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { toFindListOptions } from '../../../shared/pagination/pagination.utils';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { MetadataSchemaFormComponent } from './metadata-schema-form/metadata-schema-form.component';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html',
  styleUrls: ['./metadata-registry.component.scss'],
  imports: [
    AsyncPipe,
    MetadataSchemaFormComponent,
    NgClass,
    PaginationComponent,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * A component used for managing all existing metadata schemas within the repository.
 * The admin can create, edit or delete metadata schemas here.
 */
export class MetadataRegistryComponent implements OnDestroy, OnInit {

  /**
   * A list of all the current metadata schemas within the repository
   */
  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;

  /**
   * The {@link MetadataSchema}that is being edited
   */
  activeMetadataSchema$: Observable<MetadataSchema>;

  /**
   * The selected {@link MetadataSchema} IDs
   */
  selectedMetadataSchemaIDs$: Observable<number[]>;

  /**
   * Pagination config used to display the list of metadata schemas
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'rm',
    pageSize: 25,
  });

  /**
   * Whether the list of MetadataSchemas needs an update
   */
  needsUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  subscriptions: Subscription[] = [];

  constructor(
    protected registryService: RegistryService,
    protected notificationsService: NotificationsService,
    protected paginationService: PaginationService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.activeMetadataSchema$ = this.registryService.getActiveMetadataSchema();
    this.selectedMetadataSchemaIDs$ = this.registryService.getSelectedMetadataSchemas().pipe(
      map((schemas: MetadataSchema[]) => schemas.map((schema: MetadataSchema) => schema.id)),
    );
    this.updateSchemas();
  }

  /**
   * Update the list of schemas by fetching it from the rest api or cache
   */
  private updateSchemas() {

    this.metadataSchemas = this.needsUpdate$.pipe(
      filter((update) => update === true),
      switchMap(() => this.paginationService.getCurrentPagination(this.config.id, this.config)),
      switchMap((currentPagination) => this.registryService.getMetadataSchemas(toFindListOptions(currentPagination))),
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
    this.subscriptions.push(this.activeMetadataSchema$.pipe(take(1)).subscribe((activeSchema: MetadataSchema) => {
      if (schema === activeSchema) {
        this.registryService.cancelEditMetadataSchema();
      } else {
        this.registryService.editMetadataSchema(schema);
      }
    }));
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
   * Delete all the selected metadata schemas
   */
  deleteSchemas() {
    this.subscriptions.push(this.selectedMetadataSchemaIDs$.pipe(
      take(1),
      switchMap((schemaIDs: number[]) => zip(schemaIDs.map((schemaID: number) => this.registryService.deleteMetadataSchema(schemaID).pipe(getFirstCompletedRemoteData())))),
    ).subscribe((responses: RemoteData<NoContent>[]) => {
      const successResponses: RemoteData<NoContent>[] = responses.filter((response: RemoteData<NoContent>) => response.hasSucceeded);
      const failedResponses: RemoteData<NoContent>[] = responses.filter((response: RemoteData<NoContent>) => response.hasFailed);
      if (successResponses.length > 0) {
        this.showNotification(true, successResponses.length);
      }
      if (failedResponses.length > 0) {
        this.showNotification(false, failedResponses.length);
      }
      this.registryService.deselectAllMetadataSchema();
      this.registryService.cancelEditMetadataSchema();
    }));
  }

  /**
   * Show notifications for an amount of deleted metadata schemas
   * @param success   Whether or not the notification should be a success message (error message when false)
   * @param amount    The amount of deleted metadata schemas
   */
  showNotification(success: boolean, amount: number) {
    const prefix = 'admin.registries.schema.notification';
    const suffix = success ? 'success' : 'failure';

    const head: string = this.translateService.instant(success ? `${prefix}.${suffix}` : `${prefix}.${suffix}`);
    const content: string = this.translateService.instant(`${prefix}.deleted.${suffix}`, { amount: amount });

    if (success) {
      this.notificationsService.success(head, content);
    } else {
      this.notificationsService.error(head, content);
    }
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config.id);
    this.subscriptions.map((subscription: Subscription) => subscription.unsubscribe());
  }

}
