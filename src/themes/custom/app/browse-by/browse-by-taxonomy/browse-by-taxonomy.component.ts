import { Component } from '@angular/core';
import { BrowseByTaxonomyComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';

@Component({
  selector: 'ds-browse-by-taxonomy',
  // templateUrl: './browse-by-taxonomy.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component.html',
  // styleUrls: ['./browse-by-taxonomy.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component.scss'],
})
@rendersBrowseBy(BrowseByDataType.Hierarchy, Context.Any, 'custom')
export class BrowseByTaxonomyComponent extends BaseComponent {
}
