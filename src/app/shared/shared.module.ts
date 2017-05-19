import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PaginationModule } from 'ng2-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ApiService } from './api.service';
import { PaginationComponent } from "./pagination/pagination.component";
import { FileSizePipe } from "./utils/file-size-pipe";
import { ThumbnailComponent } from "../thumbnail/thumbnail.component";
import { SafeUrlPipe } from "./utils/safe-url-pipe";

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  RouterModule,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule,
  Ng2PaginationModule,
  NgbModule
];

const PIPES = [
    FileSizePipe,
    SafeUrlPipe
  // put pipes here
];

const COMPONENTS = [
  // put shared components here
  PaginationComponent,
  ThumbnailComponent
];

const PROVIDERS = [
  ApiService
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
