import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormOptionConfig,
  DynamicFormService,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';

import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { EntityTypeDataService } from '../../core/data/entity-type-data.service';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { SubmissionDefinitionModel } from '../../core/config/models/config-submission-definition.model';
import { catchError } from 'rxjs/operators';
import {
  collectionFormCorrectionSubmissionDefinitionSelectionConfig,
  collectionFormEntityTypeSelectionConfig,
  collectionFormModels,
  collectionFormSharedWorkspaceCheckboxConfig,
  collectionFormSubmissionDefinitionSelectionConfig
} from './collection-form.models';
import { SubmissionDefinitionsConfigDataService } from '../../core/config/submission-definitions-config-data.service';
import { ConfigObject } from '../../core/config/models/config.model';
import { NONE_ENTITY_TYPE } from '../../core/shared/item-relationships/item-type.resource-type';
import { hasNoValue, isNotNull } from 'src/app/shared/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> implements OnInit, OnChanges {
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
   * The dynamic form field used for correction submission definition selection
   * @type {DynamicSelectModel<string>}
   */
  correctionSubmissionDefinitionSelection: DynamicSelectModel<string> = new DynamicSelectModel(collectionFormCorrectionSubmissionDefinitionSelectionConfig);

  sharedWorkspaceChekbox: DynamicCheckboxModel = new DynamicCheckboxModel(collectionFormSharedWorkspaceCheckboxConfig);

  /**
   * The dynamic form fields used for creating/editing a collection
   * @type {DynamicFormControlModel[]}
   */
  formModel: DynamicFormControlModel[];

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CollectionDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected entityTypeService: EntityTypeDataService,
                     protected chd: ChangeDetectorRef,
                     protected modalService: NgbModal,
                     protected submissionDefinitionService: SubmissionDefinitionsConfigDataService) {
    super(formService, translate, notificationsService, authService, requestService, objectCache, modalService);
  }

  ngOnInit(): void {
    if (hasNoValue(this.formModel) && isNotNull(this.dso)) {
      this.initializeForm();
    }
  }

  /**
   * Detect changes to the dso and initialize the form,
   * if the dso changes, exists and it is not the first change
   */
  ngOnChanges(changes: SimpleChanges) {
    const dsoChange: SimpleChange = changes.dso;
    if (this.dso && dsoChange && !dsoChange.isFirstChange()) {
      this.initializeForm();
    }
  }

  initializeForm() {
    let currentRelationshipValue: MetadataValue[];
    let currentDefinitionValue: MetadataValue[];
    let currentCorrectionDefinitionValue: MetadataValue[];
    let currentSharedWorkspaceValue: MetadataValue[];
    if (this.dso && this.dso.metadata) {
      currentRelationshipValue = this.dso.metadata['dspace.entity.type'];
      currentDefinitionValue = this.dso.metadata['cris.submission.definition'];
      currentCorrectionDefinitionValue = this.dso.metadata['cris.submission.definition-correction'];
      currentSharedWorkspaceValue = this.dso.metadata['cris.workspace.shared'];
    }

    const entities$: Observable<ItemType[]> = this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload()
    );

    const definitions$: Observable<ConfigObject[]> = this.submissionDefinitionService
      .findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
        getFirstSucceededRemoteListPayload(),
        catchError(() => observableOf([]))
      );

    // retrieve all entity types and submission definitions to populate the dropdowns selection
    combineLatest([entities$, definitions$])
        .subscribe(([entityTypes, definitions]: [ItemType[], SubmissionDefinitionModel[]]) => {

          const sortedEntityTypes = entityTypes
              .filter((type: ItemType) => type.label !== NONE_ENTITY_TYPE)
              .sort((a, b) => a.label.localeCompare(b.label));

          sortedEntityTypes.forEach((type: ItemType, index: number) => {
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
          this.correctionSubmissionDefinitionSelection.add({
            disabled: false,
            label: definition.name,
            value: definition.name
          } as DynamicFormOptionConfig<string>);
          if (currentDefinitionValue && currentDefinitionValue.length > 0 && currentDefinitionValue[0].value === definition.name) {
            this.submissionDefinitionSelection.select(index);
          }
          if (currentCorrectionDefinitionValue && currentCorrectionDefinitionValue.length > 0 && currentCorrectionDefinitionValue[0].value === definition.name) {
            this.correctionSubmissionDefinitionSelection.select(index);
          }
        });

        this.formModel = entityTypes.length === 0 ?
          [...collectionFormModels, this.submissionDefinitionSelection, this.correctionSubmissionDefinitionSelection, this.sharedWorkspaceChekbox] :
          [...collectionFormModels, this.entityTypeSelection, this.submissionDefinitionSelection, this.correctionSubmissionDefinitionSelection, this.sharedWorkspaceChekbox];

        super.ngOnInit();

        if (currentSharedWorkspaceValue && currentSharedWorkspaceValue.length > 0) {
          this.sharedWorkspaceChekbox.value = currentSharedWorkspaceValue[0].value === 'true';
        }
        this.chd.detectChanges();
    });

  }
}
