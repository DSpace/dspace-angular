import {
  AsyncPipe,
  CommonModule,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GrantRequestCopyComponent as BaseComponent } from 'src/app/request-copy/grant-request-copy/grant-request-copy.component';

import { ThemedEmailRequestCopyComponent } from '../../../../../app/request-copy/email-request-copy/themed-email-request-copy.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-grant-request-copy',
  // styleUrls: ['./grant-request-copy.component.scss'],
  styleUrls: ['../../../../../app/request-copy/grant-request-copy/grant-request-copy.component.scss'],
  // templateUrl: './grant-request-copy.component.html',
  templateUrl: '../../../../../app/request-copy/grant-request-copy/grant-request-copy.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    FormsModule,
    RouterLink,
    ThemedEmailRequestCopyComponent,
    ThemedLoadingComponent,
    TranslatePipe,
    VarDirective,
  ],
})
export class GrantRequestCopyComponent extends BaseComponent {
}
