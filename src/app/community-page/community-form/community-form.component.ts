import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel,
} from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RequestService } from '../../core/data/request.service';
import { Community } from '../../core/shared/community.model';
import { ComColFormComponent } from '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { FormComponent } from '../../shared/form/form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Form used for creating and editing communities
 */
@Component({
  selector: 'ds-community-form',
  styleUrls: ['../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ComcolPageLogoComponent,
    FormComponent,
    TranslateModule,
    UploaderComponent,
    VarDirective,
  ],
})
export class CommunityFormComponent extends ComColFormComponent<Community> implements OnChanges {
  /**
   * @type {Community} A new community when a community is being created, an existing Input community when a community is being edited
   */
  @Input() dso: Community = new Community();

  /**
   * @type {Community.type} This is a community-type form
   */
  type = Community.type;

  /**
   * The dynamic form fields used for creating/editing a community
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      required: true,
      validators: {
        required: null,
      },
      errorMessages: {
        required: 'Please enter a name for this title',
      },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      spellCheck: environment.form.spellCheck,
    }),
  ];

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected modalService: NgbModal) {
    super(formService, translate, notificationsService, authService, requestService, objectCache, modalService);
  }

  ngOnChanges(changes: SimpleChanges) {
    const dsoChange: SimpleChange = changes.dso;
    if (this.dso && dsoChange && !dsoChange.isFirstChange()) {
      super.ngOnInit();
    }
  }
}
