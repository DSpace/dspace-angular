import { Component } from '@angular/core';
import { BrowseByTitlePageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-title-page/browse-by-title-page.component';
import { rendersBrowseBy, BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-title-page',
  // styleUrls: ['./browse-by-title-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  // templateUrl: './browse-by-title-page.component.html'
  templateUrl: '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.html'
})
@rendersBrowseBy(BrowseByDataType.Title, Context.Any, 'custom')
export class BrowseByTitlePageComponent extends BaseComponent {
}
