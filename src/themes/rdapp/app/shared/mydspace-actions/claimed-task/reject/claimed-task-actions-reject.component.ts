import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { ClaimedTaskActionsRejectComponent as BaseComponent } from '../../../../../../../app/shared/mydspace-actions/claimed-task/reject/claimed-task-actions-reject.component';

@Component({
  selector: 'ds-claimed-task-actions-reject',
  styleUrls: ['../../../../../../../app/shared/mydspace-actions/claimed-task/reject/claimed-task-actions-reject.component.scss'],
  templateUrl: '../../../../../../../app/shared/mydspace-actions/claimed-task/reject/claimed-task-actions-reject.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgbTooltip,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ClaimedTaskActionsRejectComponent extends BaseComponent {

  /**
   * A base troca o card por um "rejeitado" e mantém o contador. Sem objeto recarregado, ela refaz a busca, o card
   * sai da lista e o contador atualiza sem recarregar a página (HU012 CA01.1, melhoria M1).
   */
  public handleReloadableActionResponse(result: boolean, dso: DSpaceObject): void {
    super.handleReloadableActionResponse(result, null);
  }
}
