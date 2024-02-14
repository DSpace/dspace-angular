import { Component } from '@angular/core';
import { BrowseByDateComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-date/browse-by-date.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-date',
  // styleUrls: ['./browse-by-date.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.scss'],
  // templateUrl: './browse-by-date.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.html',
})
@rendersBrowseBy(BrowseByDataType.Date, Context.Any, 'custom')
export class BrowseByDateComponent extends BaseComponent {
}
