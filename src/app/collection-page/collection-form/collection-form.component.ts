import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { ConfigObject } from '@dspace/core/config/models/config.model';
import { SubmissionDefinitionModel } from '@dspace/core/config/models/config-submission-definition.model';
import { SubmissionDefinitionsConfigDataService } from '@dspace/core/config/submission-definitions-config-data.service';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { EntityTypeDataService } from '@dspace/core/data/entity-type-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { ItemType } from '@dspace/core/shared/item-relationships/item-type.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { getFirstSucceededRemoteListPayload } from '@dspace/core/shared/operators';
import {
  hasNoValue,
  hasValue,
  isNotNull,
} from '@dspace/shared/utils/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicFormOptionConfig,
  DynamicFormService,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  catchError,
  forkJoin,
  Observable,
  of,
  Subscription,
} from 'rxjs';

import { ComColFormComponent } from '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { FormComponent } from '../../shared/form/form.component';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { VarDirective } from '../../shared/utils/var.directive';
import {
  collectionFormEntityTypeSelectionConfig,
  collectionFormModels,
  collectionFormSharedWorkspaceCheckboxConfig,
  collectionFormSubmissionDefinitionSelectionConfig,
} from './collection-form.models';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html',
  imports: [
    AsyncPipe,
    ComcolPageLogoComponent,
    FormComponent,
    TranslateModule,
    UploaderComponent,
    VarDirective,
  ],
})
export class CollectionFormComponent extends ComColFormComponent<Collection> implements OnInit, OnChanges, OnDestroy {
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

  sharedWorkspaceChekbox: DynamicCheckboxModel = new DynamicCheckboxModel(collectionFormSharedWorkspaceCheckboxConfig);

  /**
   * The dynamic form fields used for creating/editing a collection
   * @type {DynamicFormControlModel[]}
   */
  formModel: DynamicFormControlModel[];

  /**
   * Subscription to unsubscribe on destroy
   *
   * @private
   */
  private initSubscription: Subscription;

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CollectionDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected entityTypeService: EntityTypeDataService,
                     protected chd: ChangeDetectorRef,
                     protected submissionDefinitionService: SubmissionDefinitionsConfigDataService,
                     protected modalService: NgbModal) {
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

  /**
   * Clean up eventual subscription when component gets destroyed
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (hasValue(this.initSubscription)) {
      this.initSubscription.unsubscribe();
    }
  }

  initializeForm() {
    let currentRelationshipValue: MetadataValue[];
    let currentDefinitionValue: MetadataValue[];
    let currentSharedWorkspaceValue: MetadataValue[];
    if (this.dso && this.dso.metadata) {
      currentRelationshipValue = this.dso.metadata['dspace.entity.type'];
      currentDefinitionValue = this.dso.metadata['dspace.submission.definition'];
      currentSharedWorkspaceValue = this.dso.metadata['dspace.workspace.shared'];
    }

    const entities$: Observable<ItemType[]> = this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload(),
    );

    const definitions$: Observable<ConfigObject[]> = this.submissionDefinitionService
      .findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
        getFirstSucceededRemoteListPayload(),
        catchError(() => of([])),
      );

    // retrieve all entity types and submission definitions to populate the dropdowns selection
    this.initSubscription = forkJoin({
      entityTypes: entities$,
      definitions: definitions$,
    }).subscribe(({ entityTypes, definitions }:  {entityTypes: ItemType[]; definitions: ConfigObject[]}) => {
      const sortedEntityTypes = entityTypes
        .sort((a, b) => a.label.localeCompare(b.label));

      sortedEntityTypes.forEach((type: ItemType, index: number) => {
        this.entityTypeSelection.add({
          disabled: false,
          label: type.label,
          value: type.label,
        } as DynamicFormOptionConfig<string>);
        if (currentRelationshipValue && currentRelationshipValue.length > 0 && currentRelationshipValue[0].value === type.label) {
          this.entityTypeSelection.select(index);
          this.entityTypeSelection.disabled = true;
        }
      });

      definitions.filter(def => !def.id.includes('-edit')).forEach((definition: SubmissionDefinitionModel, index: number) => {
        this.submissionDefinitionSelection.add({
          disabled: false,
          label: definition.name,
          value: definition.name,
        } as DynamicFormOptionConfig<string>);
        if (currentDefinitionValue && currentDefinitionValue.length > 0 && currentDefinitionValue[0].value === definition.name) {
          this.submissionDefinitionSelection.select(index);
        }
      });

      this.formModel = entityTypes.length === 0 ?
        [...collectionFormModels, this.submissionDefinitionSelection, this.sharedWorkspaceChekbox] :
        [...collectionFormModels, this.entityTypeSelection, this.submissionDefinitionSelection, this.sharedWorkspaceChekbox];

      super.ngOnInit();

      if (currentSharedWorkspaceValue && currentSharedWorkspaceValue.length > 0) {
        this.sharedWorkspaceChekbox.value = currentSharedWorkspaceValue[0].value === 'true';
      }
      this.chd.detectChanges();
    });

  }
}
