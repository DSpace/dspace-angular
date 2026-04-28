import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { getCollectionPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Collection } from '@dspace/core/shared/collection.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { EditComColPageComponent } from '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component';

/**
 * Component that represents the page where a user can edit an existing Collection
 */
@Component({
  selector: 'ds-edit-collection',
  templateUrl: '../../shared/comcol/comcol-forms/edit-comcol-page/edit-comcol-page.component.html',
  styleUrls: ['./edit-collection-page.component.scss'],
  imports: [
    AsyncPipe,
    NgbTooltip,
    NgClass,
    RouterLink,
    RouterOutlet,
    TranslateModule,
  ],
})
export class EditCollectionPageComponent extends EditComColPageComponent<Collection> {
  type = 'collection';

  public constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected injector: Injector,
  ) {
    super(router, route, injector);
  }

  /**
   * Get the collection page url
   * @param collection The collection for which the url is requested
   */
  getPageUrl(collection: Collection): string {
    return getCollectionPageRoute(collection.id);
  }
}
