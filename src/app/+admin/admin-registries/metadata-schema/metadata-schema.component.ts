import { Component, OnInit } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataField } from '../../../core/metadata/metadatafield.model';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';

@Component({
  selector: 'ds-metadata-schema',
  templateUrl: './metadata-schema.component.html'
})
export class MetadataSchemaComponent implements OnInit {

  namespace;

  metadataSchema: Observable<RemoteData<MetadataSchema>>;
  metadataFields: Observable<RemoteData<PaginatedList<MetadataField>>>;

  constructor(private registryService: RegistryService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initialize(params);
    });
  }

  initialize(params) {
    this.metadataSchema = this.registryService.getMetadataSchemaByName(params.schemaName);
    this.metadataSchema.subscribe((value) => {
      const schema = value.payload;
      this.metadataFields = this.registryService.getMetadataFieldsBySchema(schema);
      this.namespace = { namespace: value.payload.namespace };
    });
  }

}
