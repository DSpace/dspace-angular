import { Component, OnInit } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataField } from '../../../core/metadata/metadatafield.model';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-metadata-schema',
  templateUrl: './metadata-schema.component.html'
})
export class MetadataSchemaComponent implements OnInit {

  namespace;

  metadataSchema: Observable<RemoteData<MetadataSchema>>;
  metadataFields: Observable<RemoteData<PaginatedList<MetadataField>>>;
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-metadatafields-pagination',
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 200]
  });

  constructor(private registryService: RegistryService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initialize(params);
    });
  }

  initialize(params) {
    this.metadataSchema = this.registryService.getMetadataSchemaByName(params.schemaName);
    this.updateFields();
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.updateFields();
  }

  private updateFields() {
    this.metadataSchema.subscribe((schemaData) => {
      const schema = schemaData.payload;
      this.metadataFields = this.registryService.getMetadataFieldsBySchema(schema, this.config);
      this.namespace = {namespace: schemaData.payload.namespace};
    });
  }

  editField(field: MetadataField) {
    this.registryService.editMetadataField(field);
  }

  isActive(field: MetadataField): Observable<boolean> {
    return this.getActiveField().pipe(
      map((activeField) => field === activeField)
    );
  }

  getActiveField(): Observable<MetadataField> {
    return this.registryService.getActiveMetadataField();
  }

  selectMetadataField(field: MetadataField, event) {
    event.target.checked ?
      this.registryService.selectMetadataField(field) :
      this.registryService.deselectMetadataField(field);
  }

  isSelected(field: MetadataField): Observable<boolean> {
    return this.registryService.getSelectedMetadataFields().pipe(
      map((fields) => fields.find((selectedField) => selectedField === field) != null)
    );
  }

  deleteFields() {
    this.registryService.getSelectedMetadataFields().subscribe(
      (fields) => {
        console.log('metadata fields to delete: ');
        for (const field of fields) {
          console.log(field);
        }
      }
    )
  }
}
