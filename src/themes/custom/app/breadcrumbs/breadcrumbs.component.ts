import { Component } from '@angular/core';

import { BreadcrumbsComponent as BaseComponent } from '../../../../app/breadcrumbs/breadcrumbs.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
    selector: 'ds-breadcrumbs',
    // templateUrl: './breadcrumbs.component.html',
    templateUrl: '../../../../app/breadcrumbs/breadcrumbs.component.html',
    // styleUrls: ['./breadcrumbs.component.scss']
    styleUrls: ['../../../../app/breadcrumbs/breadcrumbs.component.scss'],
    standalone: true,
    imports: [VarDirective, NgIf, NgTemplateOutlet, NgFor, RouterLink, NgbTooltipModule, AsyncPipe, TranslateModule]
})
export class BreadcrumbsComponent extends BaseComponent {
}
