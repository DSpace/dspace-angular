import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SubgroupsListComponent as BaseComponent } from '../../../../../../../app/access-control/group-registry/group-form/subgroup-list/subgroups-list.component';
import { ContextHelpDirective } from '../../../../../../../app/shared/context-help.directive';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';

/**
 * Lista de subgrupos com rótulos de acessibilidade e sem id duplicado (HU009 D15).
 */
@Component({
  selector: 'ds-themed-subgroups-list',
  templateUrl: './subgroups-list.component.html',
  imports: [
    AsyncPipe,
    ContextHelpDirective,
    PaginationComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class SubgroupsListComponent extends BaseComponent {
}
