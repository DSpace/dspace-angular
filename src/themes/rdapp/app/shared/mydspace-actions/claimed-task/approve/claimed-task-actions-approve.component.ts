import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { ClaimedTaskActionsApproveComponent as BaseComponent } from '../../../../../../../app/shared/mydspace-actions/claimed-task/approve/claimed-task-actions-approve.component';

@Component({
  selector: 'ds-claimed-task-actions-approve',
  styleUrls: ['../../../../../../../app/shared/mydspace-actions/claimed-task/approve/claimed-task-actions-approve.component.scss'],
  templateUrl: '../../../../../../../app/shared/mydspace-actions/claimed-task/approve/claimed-task-actions-approve.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbTooltip,
    TranslateModule,
  ],
})
export class ClaimedTaskActionsApproveComponent extends BaseComponent {

  /**
   * A base troca o card por um "aprovado" e mantém o contador. Sem objeto recarregado, ela refaz a busca, o card
   * sai da lista e o contador atualiza sem recarregar a página (HU012 CA01.1, melhoria M1).
   */
  public handleReloadableActionResponse(result: boolean, dso: DSpaceObject): void {
    super.handleReloadableActionResponse(result, null);
  }
}
