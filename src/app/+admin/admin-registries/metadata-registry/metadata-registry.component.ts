import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';

@Component({
  selector: 'ds-metadata-registry',
  templateUrl: './metadata-registry.component.html'
})
export class MetadataRegistryComponent {

  metadataSchemas: Observable<RemoteData<PaginatedList<MetadataSchema>>>;

  constructor(private registryService: RegistryService) {
    this.metadataSchemas = this.registryService.getMetadataSchemas();
  }

}
