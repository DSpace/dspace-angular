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
import { FindListOptions } from '../../core/data/request.models';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';

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

  entityTypeSelection: DynamicSelectModel<string> = new DynamicSelectModel({
    id: 'entitytype',
    name: 'relationship.type',
    required: true,
    disabled: false,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'Please choose a type'
    },
  });

  /**
   * The dynamic form fields used for creating/editing a collection
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
    }),
    new DynamicTextAreaModel({
      id: 'license',
      name: 'dc.rights.license',
    }),
    this.entityTypeSelection,
  ];

  public constructor(protected location: Location,
                     protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected entityTypeService: EntityTypeService) {
    super(location, formService, translate, notificationsService, authService, requestService, objectCache);
  }

  ngOnInit() {

    let tmp: MetadataValue[];
    if (this.dso && this.dso.metadata) {
      tmp = this.dso.metadata['relationship.type'];
    }
    // retrieve all entity types to populate a dropdown selection
    this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 } as FindListOptions).pipe(
      getFirstSucceededRemoteListPayload()
    ).subscribe((data: ItemType[]) => {
      let index = 0;
      data.map((type: ItemType) => {
        this.entityTypeSelection.add({
          disabled: false,
          label: type.label,
          value: type.label
        } as DynamicFormOptionConfig<string>);
        if (tmp && tmp.length > 0 && tmp[0].value === type.label) {
          this.entityTypeSelection.select(index);
          this.entityTypeSelection.disabled = true;
        }
        index++;
      });
    });
    super.ngOnInit();
  }
}
