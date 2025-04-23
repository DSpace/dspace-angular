import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ComcolPageBrowseByComponent as BaseComponent } from '../../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';

@Component({
  selector: 'ds-themed-comcol-page-browse-by',
  // styleUrls: ['./comcol-page-browse-by.component.scss'],
  styleUrls: ['../../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.scss'],
  // templateUrl: './comcol-page-browse-by.component.html'
  templateUrl: '../../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class ComcolPageBrowseByComponent extends BaseComponent {
}
