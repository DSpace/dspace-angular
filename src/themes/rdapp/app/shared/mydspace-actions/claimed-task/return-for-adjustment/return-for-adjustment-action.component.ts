import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { ClaimedDeclinedTaskSearchResult } from '@dspace/core/shared/object-collection/claimed-declined-task-search-result.model';
import {
  NgbModal,
  NgbModalRef,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { ClaimedTaskActionsAbstractComponent } from '../../../../../../../app/shared/mydspace-actions/claimed-task/abstract/claimed-task-actions-abstract.component';
import { SearchService } from '../../../../../../../app/shared/search/search.service';

export const WORKFLOW_TASK_OPTION_RETURN_FOR_ADJUSTMENT =
  'submit_returnForAdjustmentAction';
@Component({
  selector: 'ds-return-for-adjustment-action',
  styleUrls: ['./return-for-adjustment-action.component.scss'],
  templateUrl: './return-for-adjustment-action.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ReturnForAdjustmentActionComponent
  extends ClaimedTaskActionsAbstractComponent
  implements OnInit {
  public adjustmentForm: UntypedFormGroup;
  public modalRef: NgbModalRef;
  public option = WORKFLOW_TASK_OPTION_RETURN_FOR_ADJUSTMENT;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
  ) {
    super(
      injector,
      router,
      notificationsService,
      translate,
      searchService,
      requestService,
    );
  }

  ngOnInit() {
    this.adjustmentForm = this.formBuilder.group({
      reason: ['', Validators.required],
    });
  }

  submitTask() {
    this.modalRef.close('Send Button');

    super.submitTask();
  }

  createbody(): any {
    const reason = this.adjustmentForm.get('reason').value;

    return Object.assign(super.createbody(), { reason });
  }

  openAdjustmentModal(content: any) {
    this.adjustmentForm.reset();
    this.modalRef = this.modalService.open(content);
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return of(this.object);
  }

  /**
   * Como no aprovar e no rejeitar do tema: refaz a busca para o card sair da lista e o contador atualizar sem
   * recarregar a página (HU012 CA01.1, melhoria M1).
   */
  public handleReloadableActionResponse(result: boolean, dso: DSpaceObject): void {
    super.handleReloadableActionResponse(result, null);
  }

  convertReloadedObject(dso: DSpaceObject): DSpaceObject {
    const reloadedObject = Object.assign(
      new ClaimedDeclinedTaskSearchResult(),
      dso,
      {
        indexableObject: dso,
      },
    );
    return reloadedObject;
  }
}
