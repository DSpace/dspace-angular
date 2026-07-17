import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { AbstractBrowseElementsComponent } from '../abstract-browse-elements.component';

@Component({
  selector: 'ds-base-default-browse-elements',
  templateUrl: './default-browse-elements.component.html',
  styleUrls: ['./default-browse-elements.component.scss'],
  imports: [
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class DefaultBrowseElementsComponent extends AbstractBrowseElementsComponent implements OnInit, OnChanges {

  protected followThumbnailLink: boolean;

  ngOnInit() {
    this.followThumbnailLink = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    super.ngOnInit();
  }
}
