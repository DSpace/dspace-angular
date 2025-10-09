import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EditItemTemplatePageComponent as BaseComponent } from '../../../../../app/collection-page/edit-item-template-page/edit-item-template-page.component';
import { ThemedDsoEditMetadataComponent } from '../../../../../app/dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-edit-item-template-page',
  styleUrls: ['./edit-item-template-page.component.scss'],
  // templateUrl: './edit-item-template-page.component.html',
  templateUrl: '../../../../../app/collection-page/edit-item-template-page/edit-item-template-page.component.html',
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    RouterLink,
    ThemedDsoEditMetadataComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class EditItemTemplatePageComponent extends BaseComponent {
}
