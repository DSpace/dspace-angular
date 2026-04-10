import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { CollectionPageComponent as BaseComponent } from '../../../../app/collection-page/collection-page.component';
import {
  fadeIn,
  fadeInOut,
} from '../../../../app/shared/animations/fade';
import { ThemedComcolPageBrowseByComponent } from '../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageHandleComponent } from '../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { DsoEditMenuComponent } from '../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    DsoEditMenuComponent,
    ErrorComponent,
    RouterLink,
    RouterOutlet,
    ThemedComcolPageBrowseByComponent,
    ThemedComcolPageHandleComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class CollectionPageComponent extends BaseComponent implements OnInit {

  private titleService = inject(Title);

  override ngOnInit(): void {
    super.ngOnInit();
    this.collectionRD$.pipe(
      filter(rd => rd?.hasSucceeded),
      map(rd => rd.payload),
      filter(c => !!c),
      take(1),
    ).subscribe(collection => {
      this.titleService.setTitle(this.dsoNameService.getName(collection));
    });
  }
}
