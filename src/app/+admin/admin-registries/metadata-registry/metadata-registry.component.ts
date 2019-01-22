import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html',
  styleUrls: ['./metadata-registry.component.scss']
})
export class MetadataRegistryComponent {

  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;

  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-metadataschemas-pagination',
    pageSize: 2
  });

  constructor(private registryService: RegistryService,
              private notificationsService: NotificationsService,
              private router: Router,
              private translateService: TranslateService) {
    this.updateSchemas();
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.updateSchemas();
  }

  private updateSchemas() {
    this.metadataSchemas = this.registryService.getMetadataSchemas(this.config);
  }

  private forceUpdateSchemas() {
    this.registryService.clearMetadataSchemaRequests().subscribe();
    this.updateSchemas();
  }

  editSchema(schema: MetadataSchema) {
    this.getActiveSchema().pipe(take(1)).subscribe((activeSchema) => {
      if (schema === activeSchema) {
        this.registryService.cancelEditMetadataSchema();
      } else {
        this.registryService.editMetadataSchema(schema);
      }
    });
  }

  isActive(schema: MetadataSchema): Observable<boolean> {
    return this.getActiveSchema().pipe(
      map((activeSchema) => schema === activeSchema)
    );
  }

  getActiveSchema(): Observable<MetadataSchema> {
    return this.registryService.getActiveMetadataSchema();
  }

  selectMetadataSchema(schema: MetadataSchema, event) {
    event.target.checked ?
      this.registryService.selectMetadataSchema(schema) :
      this.registryService.deselectMetadataSchema(schema);
  }

  isSelected(schema: MetadataSchema): Observable<boolean> {
    return this.registryService.getSelectedMetadataSchemas().pipe(
      map((schemas) => schemas.find((selectedSchema) => selectedSchema === schema) != null)
    );
  }

  deleteSchemas() {
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
          this.router.navigate([], { queryParams: { page: 1 }, queryParamsHandling: 'merge'});
          this.forceUpdateSchemas();
        });
      }
    )
  }

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
