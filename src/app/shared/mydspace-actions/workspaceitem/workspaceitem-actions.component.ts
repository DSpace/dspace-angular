import { Component, Injector, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { NormalizedWorkspaceItem } from '../../../core/submission/models/normalized-workspaceitem.model';
import { SubmissionRestService } from '../../../submission/submission-rest.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { ResourceType } from '../../../core/shared/resource-type';

@Component({
  selector: 'ds-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: './workspaceitem-actions.component.html',
})

export class WorkspaceitemActionsComponent extends MyDSpaceActionsComponent<Workspaceitem, NormalizedWorkspaceItem, WorkspaceitemDataService> {
  @Input() object: Workspaceitem;
  public modalRef: NgbModalRef;

  constructor(protected injector: Injector,
              protected router: Router,
              private modalService: NgbModal,
              private restService: SubmissionRestService) {
    super(ResourceType.Workspaceitem, injector, router);
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.restService.deleteById(this.object.id)
            .subscribe((response) => {
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
