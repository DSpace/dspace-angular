import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ApiService } from './api.service';
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
  NgbModule
];

const PIPES = [
    FileSizePipe,
    SafeUrlPipe
  // put pipes here
];

const COMPONENTS = [
  ThumbnailComponent
  // put shared components here
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
