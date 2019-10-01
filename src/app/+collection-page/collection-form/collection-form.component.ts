import { Component, Input } from '@angular/core';
import { DynamicFormService, DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> {
  /**
   * @type {Collection} A new collection when a collection is being created, an existing Input collection when a collection is being edited
   */
  @Input() dso: Collection = new Collection();

  /**
   * i18n key for the logo's label
   */
  protected logoLabelMsg = 'collection.edit.logo.label';

  /**
   * i18n key for the logo's drop message
   */
  protected logoDropMsg = 'collection.edit.logo.upload';

  /**
   * i18n key for the logo's upload success message
   */
  protected logoSuccessMsg = 'collection.edit.logo.notifications.success';

  /**
   * i18n key for the logo's upload error message
   */
  protected logoErrorMsg = 'collection.edit.logo.notifications.error';

  /**
   * @type {Collection.type} This is a collection-type form
   */
  protected type = Collection.type;

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
    new DynamicTextAreaModel({
      id: 'provenance',
      name: 'dc.description.provenance',
    }),
  ];

  public constructor(protected location: Location,
                     protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService) {
    super(location, formService, translate, notificationsService, authService);
  }
}
