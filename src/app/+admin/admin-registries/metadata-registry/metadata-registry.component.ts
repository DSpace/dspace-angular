import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';

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

  constructor(private registryService: RegistryService) {
    this.updateSchemas();
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.updateSchemas();
  }

  private updateSchemas() {
    this.metadataSchemas = this.registryService.getMetadataSchemas(this.config);
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
    this.registryService.getSelectedMetadataSchemas().subscribe(
      (schemas) => {
        const tasks$ = [];
        for (const schema of schemas) {
          if (hasValue(schema.id)) {
            tasks$.push(this.registryService.deleteMetadataSchema(schema.id));
          }
        }
        zip(...tasks$).subscribe((responses: RestResponse[]) => {
          console.log('deleted ' + responses.length + ' schemas');
          // TODO: Reload the list of schemas
        });
      }
    )
  }
}
