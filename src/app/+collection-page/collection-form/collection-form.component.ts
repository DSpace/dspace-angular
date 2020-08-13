import { Component, Input, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { EntityTypeService } from '../../core/data/entity-type.service';
import { DynamicFormOptionConfig } from '@ng-dynamic-forms/core/lib/model/dynamic-option-control.model';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { SubmissionDefinitionsConfigService } from '../../core/config/submission-definitions-config.service';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { SubmissionDefinitionModel } from '../../core/config/models/config-submission-definition.model';
import { map } from 'rxjs/operators';
import {
  collectionFormEntityTypeSelectionConfig,
  collectionFormModels,
  collectionFormSubmissionDefinitionSelectionConfig
} from './collection-form.models';
import { PaginatedList } from '../../core/data/paginated-list';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> implements OnInit {
  /**
   * @type {Collection} A new collection when a collection is being created, an existing Input collection when a collection is being edited
   */
  @Input() dso: Collection = new Collection();

  /**
   * @type {Collection.type} This is a collection-type form
   */
  type = Collection.type;

  /**
   * The dynamic form field used for entity type selection
   * @type {DynamicSelectModel<string>}
   */
  entityTypeSelection: DynamicSelectModel<string> = new DynamicSelectModel(collectionFormEntityTypeSelectionConfig);

  /**
   * The dynamic form field used for submission definition selection
   * @type {DynamicSelectModel<string>}
   */
  submissionDefinitionSelection: DynamicSelectModel<string> = new DynamicSelectModel(collectionFormSubmissionDefinitionSelectionConfig);

  /**
   * The dynamic form fields used for creating/editing a collection
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[];

  public constructor(protected location: Location,
                     protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected entityTypeService: EntityTypeService,
                     protected submissionDefinitionService: SubmissionDefinitionsConfigService) {
    super(location, formService, translate, notificationsService, authService, requestService, objectCache);
  }

  ngOnInit() {

    let currentRelationshipValue: MetadataValue[];
    let currentDefinitionValue: MetadataValue[];
    if (this.dso && this.dso.metadata) {
      currentRelationshipValue = this.dso.metadata['relationship.type'];
      currentDefinitionValue = this.dso.metadata['cris.submission.definition'];
    }

    const entities$: Observable<ItemType[]> = this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload()
    );

    const definitions$: Observable<SubmissionDefinitionModel[]> = this.submissionDefinitionService
      .getConfigAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
        map((result: any) => result.payload as PaginatedList<SubmissionDefinitionModel>),
        map((result: PaginatedList<SubmissionDefinitionModel>) => result.page)
      );
    combineLatest([])

    // retrieve all entity types and submission definitions to populate the dropdowns selection
    combineLatest([entities$, definitions$])
      .subscribe(([entityTypes, definitions]: [ItemType[], SubmissionDefinitionModel[]]) => {

        entityTypes.forEach((type: ItemType, index: number) => {
          this.entityTypeSelection.add({
            disabled: false,
            label: type.label,
            value: type.label
          } as DynamicFormOptionConfig<string>);
          if (currentRelationshipValue && currentRelationshipValue.length > 0 && currentRelationshipValue[0].value === type.label) {
            this.entityTypeSelection.select(index);
            this.entityTypeSelection.disabled = true;
          }
        });

        definitions.forEach((definition: SubmissionDefinitionModel, index: number) => {
          this.submissionDefinitionSelection.add({
            disabled: false,
            label: definition.name,
            value: definition.name
          } as DynamicFormOptionConfig<string>);
          if (currentDefinitionValue && currentDefinitionValue.length > 0 && currentDefinitionValue[0].value === definition.name) {
            this.submissionDefinitionSelection.select(index);
          }
        });

        this.formModel = [...collectionFormModels, this.entityTypeSelection, this.submissionDefinitionSelection];
        super.ngOnInit();
    });

  }
}
