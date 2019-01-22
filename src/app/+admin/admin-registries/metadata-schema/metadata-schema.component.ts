import { Component, OnInit } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataField } from '../../../core/metadata/metadatafield.model';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { map, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { RestResponse } from '../../../core/cache/response.models';
import { zip } from 'rxjs/internal/observable/zip';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-metadata-schema',
  templateUrl: './metadata-schema.component.html',
  styleUrls: ['./metadata-schema.component.scss']
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

  private forceUpdateFields() {
    this.registryService.clearMetadataFieldRequests().subscribe();
    this.updateFields();
  }

  editField(field: MetadataField) {
    this.getActiveField().pipe(take(1)).subscribe((activeField) => {
      if (field === activeField) {
        this.registryService.cancelEditMetadataField();
      } else {
        this.registryService.editMetadataField(field);
      }
    });
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
    this.registryService.getSelectedMetadataFields().pipe(take(1)).subscribe(
      (fields) => {
        const tasks$ = [];
        for (const field of fields) {
          if (hasValue(field.id)) {
            tasks$.push(this.registryService.deleteMetadataSchema(field.id));
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
          this.router.navigate([], { queryParams: { page: 1 }, queryParamsHandling: 'merge'});
          this.forceUpdateFields();
        });
      }
    )
  }

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
