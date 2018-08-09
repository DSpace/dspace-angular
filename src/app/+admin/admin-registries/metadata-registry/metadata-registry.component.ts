import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html'
})
export class MetadataRegistryComponent {

  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-metadataschemas-pagination',
    pageSize: 10000
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

}
