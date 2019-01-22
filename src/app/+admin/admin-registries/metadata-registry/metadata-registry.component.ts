import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html'
})
export class MetadataRegistryComponent {

  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;

  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-metadataschemas-pagination',
    pageSize: 2
  });

  constructor(private registryService: RegistryService,
              private notificationsService: NotificationsService) {
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
    this.registryService.editMetadataSchema(schema);
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
            this.notificationsService.success('Success', `Successfully deleted ${successResponses.length} metadata schemas`);
          }
          if (failedResponses.length > 0) {
            this.notificationsService.error('Error', `Failed to delete ${failedResponses.length} metadata schemas`);
          }
          this.forceUpdateSchemas();
        });
      }
    )
  }
}
