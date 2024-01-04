import { Component, Inject } from '@angular/core';
import {
  AbstractTabulatableElementComponent
} from '../../../object-collection/shared/objects-collection-tabulatable/objects-collection-tabulatable.component';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { PaginatedList } from '../../../../core/data/paginated-list.model';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``
})
export class TabulatableResultListElementsComponent<T extends PaginatedList<K>, K extends DSpaceObject> extends AbstractTabulatableElementComponent<T> {
  public constructor(protected truncatableService: TruncatableService,
                     public dsoNameService: DSONameService,
                     @Inject(APP_CONFIG) protected appConfig?: AppConfig) {
    super(dsoNameService);
  }

}
