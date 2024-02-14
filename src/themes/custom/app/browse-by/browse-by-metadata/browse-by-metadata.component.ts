import { Component } from '@angular/core';
import { BrowseByMetadataComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-metadata',
  // styleUrls: ['./browse-by-metadata.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.scss'],
  // templateUrl: './browse-by-metadata.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.html',
})
@rendersBrowseBy(BrowseByDataType.Metadata, Context.Any, 'custom')
export class BrowseByMetadataComponent extends BaseComponent {
}
