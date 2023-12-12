import { Component } from '@angular/core';
import { BrowseByTaxonomyPageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  // templateUrl: './browse-by-taxonomy-page.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.html',
  // styleUrls: ['./browse-by-taxonomy-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.scss'],
})
@rendersBrowseBy(BrowseByDataType.Hierarchy, Context.Any, 'custom')
export class BrowseByTaxonomyPageComponent extends BaseComponent {
}
