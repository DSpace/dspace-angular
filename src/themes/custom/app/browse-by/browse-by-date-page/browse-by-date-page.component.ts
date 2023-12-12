import { Component } from '@angular/core';
import { BrowseByDatePageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-date-page/browse-by-date-page.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-date-page',
  // styleUrls: ['./browse-by-date-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  // templateUrl: './browse-by-date-page.component.html'
  templateUrl: '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.html'
})
@rendersBrowseBy(BrowseByDataType.Date, Context.Any, 'custom')
export class BrowseByDatePageComponent extends BaseComponent {
}
