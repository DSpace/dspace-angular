import { Component } from '@angular/core';
import { BrowseByMetadataPageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component';
import { rendersBrowseBy, BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-metadata-page',
  // styleUrls: ['./browse-by-metadata-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  // templateUrl: './browse-by-metadata-page.component.html'
  templateUrl: '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.html'
})
@rendersBrowseBy(BrowseByDataType.Metadata, Context.Any, 'custom')
export class BrowseByMetadataPageComponent extends BaseComponent {
}
