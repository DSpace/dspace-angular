import { Component, Injector, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { NormalizedWorkspaceItem } from '../../../core/submission/models/normalized-workspaceitem.model';
import { SubmissionRestService } from '../../../submission/submission-rest.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { ResourceType } from '../../../core/shared/resource-type';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationOptions } from '../../notifications/models/notification-options.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: './workspaceitem-actions.component.html',
})

export class WorkspaceitemActionsComponent extends MyDSpaceActionsComponent<Workspaceitem, NormalizedWorkspaceItem, WorkspaceitemDataService> {
  @Input() object: Workspaceitem;

  public processingDelete = Observable.of(false);

  constructor(protected injector: Injector,
              protected router: Router,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private restService: SubmissionRestService,
              private translate: TranslateService) {
    super(ResourceType.Workspaceitem, injector, router);
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.processingDelete = Observable.of(true);
          this.restService.deleteById(this.object.id)
            .subscribe((response) => {
              this.notificationsService.success(null,
                this.translate.get('submission.workflow.tasks.generic.success'),
                new NotificationOptions(5000, false));
              this.processingDelete = Observable.of(false);
              this.reload();
            })
        }
      }
    );
  }

  initObjects(object: Workspaceitem) {
    this.object = object;
  }

}
