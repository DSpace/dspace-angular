import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MembersListComponent as BaseComponent } from '../../../../../../../app/access-control/group-registry/group-form/members-list/members-list.component';
import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { ContextHelpDirective } from '../../../../../../../app/shared/context-help.directive';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';

/**
 * Lista de membros do grupo com rótulos de acessibilidade e sem id duplicado (HU009 D15).
 */
@Component({
  selector: 'ds-themed-members-list',
  templateUrl: './members-list.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ContextHelpDirective,
    NgClass,
    PaginationComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class MembersListComponent extends BaseComponent {
}
