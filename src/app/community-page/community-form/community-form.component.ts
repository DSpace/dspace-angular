import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormService } from '@ng-dynamic-forms/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

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
import { communityFormModels } from './community-form.models';

/**
 * Form used for creating and editing communities
 */
@Component({
  selector: 'ds-community-form',
  styleUrls: ['../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html',
  standalone: true,
  imports: [
    FormComponent,
    TranslateModule,
    UploaderComponent,
    AsyncPipe,
    ComcolPageLogoComponent,
    NgIf,
    NgClass,
    NgForOf,
    VarDirective,
    FormsModule,
  ],
})
export class CommunityFormComponent extends ComColFormComponent<Community> implements OnInit, OnChanges {
  /**
   * @type {Community} A new community when a community is being created, an existing Input community when a community is being edited
   */
  @Input() dso: Community = new Community();

  /**
   * @type {Community.type} This is a community-type form
   */
  type = Community.type;

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected modalService: NgbModal,
                     protected cdr: ChangeDetectorRef) {
    super(formService, translate, notificationsService, authService, requestService, objectCache, modalService, cdr);
  }

  ngOnInit() {
    this.initializeLanguage();

    this.formModels.set(this.defaultLanguageCode, communityFormModels(this.defaultLanguageCode, true));
    this.languages.forEach(lang => {
      this.formModels.set(lang.code, communityFormModels(lang.code, false));
    });

    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    const dsoChange: SimpleChange = changes.dso;
    if (this.dso && dsoChange && !dsoChange.isFirstChange()) {
      super.ngOnInit();
    }
  }
}
