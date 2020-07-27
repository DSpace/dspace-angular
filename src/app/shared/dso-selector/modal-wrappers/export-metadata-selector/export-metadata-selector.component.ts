import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { take, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { METADATA_EXPORT_SCRIPT_NAME, ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { RequestEntry } from '../../../../core/data/request.reducer';
import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessParameter } from '../../../../process-page/processes/process-parameter.model';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';
import { isNotEmpty } from '../../../empty.util';
import { NotificationsService } from '../../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing dso's inside a modal
 * Used to choose a dso from to export metadata of
 */
@Component({
  selector: 'ds-export-metadata-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class ExportMetadataSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.DSPACEOBJECT;
  selectorType = DSpaceObjectType.DSPACEOBJECT;
  action = SelectorActionType.EXPORT_METADATA;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router,
              protected notificationsService: NotificationsService, protected translationService: TranslateService,
              protected scriptDataService: ScriptDataService,
              private modalService: NgbModal) {
    super(activeModal, route);
  }

  /**
   * If the dso is a collection or community: start export-metadata script & navigate to process if successful
   * Otherwise show error message
   */
  navigate(dso: DSpaceObject): Observable<boolean> {
    if (dso instanceof Collection || dso instanceof Community) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = dso;
      modalRef.componentInstance.headerLabel = "confirmation-modal.export-metadata.header";
      modalRef.componentInstance.infoLabel = "confirmation-modal.export-metadata.info";
      modalRef.componentInstance.cancelLabel = "confirmation-modal.export-metadata.cancel";
      modalRef.componentInstance.confirmLabel = "confirmation-modal.export-metadata.confirm";

      modalRef.componentInstance.response.subscribe((confirm: boolean) => {
        if (confirm) {
          const startScriptSucceeded = this.startScriptNotifyAndRedirect(dso, dso.handle);
          startScriptSucceeded.pipe(take(1)).subscribe();
          return startScriptSucceeded;
        } else {
          const modalRef = this.modalService.open(ExportMetadataSelectorComponent);
          modalRef.componentInstance.dsoRD = createSuccessfulRemoteDataObject(dso);
        }
      });
    } else {
      this.notificationsService.error(this.translationService.get('dso-selector.export-metadata.notValidDSO'));
      return observableOf(false);
    }
  }

  /**
   * Start export-metadata script of dso & navigate to process if successful
   * Otherwise show error message
   * @param dso   Dso to export
   */
  private startScriptNotifyAndRedirect(dso: DSpaceObject, handle: string): Observable<boolean> {
    const parameterValues: ProcessParameter[] = [
      Object.assign(new ProcessParameter(), { name: '-i', value: handle }),
      Object.assign(new ProcessParameter(), { name: '-f', value: dso.uuid + '.csv' }),
    ];
    return this.scriptDataService.invoke(METADATA_EXPORT_SCRIPT_NAME, parameterValues, [])
      .pipe(
        take(1),
        map((requestEntry: RequestEntry) => {
          if (requestEntry.response.isSuccessful) {
            const title = this.translationService.get('process.new.notification.success.title');
            const content = this.translationService.get('process.new.notification.success.content');
            this.notificationsService.success(title, content);
            const response: any = requestEntry.response;
            if (isNotEmpty(response.resourceSelfLinks)) {
              const processNumber = response.resourceSelfLinks[0].split('/').pop();
              this.router.navigateByUrl('/processes/' + processNumber);
            }
            return true;
          } else {
            const title = this.translationService.get('process.new.notification.error.title');
            const content = this.translationService.get('process.new.notification.error.content');
            this.notificationsService.error(title, content);
            return false;
          }
        }));
  }
}
