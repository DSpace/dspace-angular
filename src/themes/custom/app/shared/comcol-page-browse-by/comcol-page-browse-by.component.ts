import {
  AsyncPipe,
  NgForOf,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ComcolPageBrowseByComponent as BaseComponent } from '../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  // styleUrls: ['./comcol-page-browse-by.component.scss'],
  styleUrls: ['../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.scss'],
  // templateUrl: './comcol-page-browse-by.component.html'
  templateUrl: '../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    AsyncPipe,
  ],
})
export class ComcolPageBrowseByComponent extends BaseComponent {}
