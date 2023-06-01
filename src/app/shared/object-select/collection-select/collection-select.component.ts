import { Component } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';
import { isNotEmpty } from '../../empty.util';
import { ObjectSelectService } from '../object-select.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-collection-select',
  templateUrl: './collection-select.component.html',
  styleUrls: ['./collection-select.component.scss'],
})

/**
 * A component used to select collections from a specific list and returning the UUIDs of the selected collections
 */
export class CollectionSelectComponent extends ObjectSelectComponent<Collection> {

  constructor(
    protected objectSelectService: ObjectSelectService,
    protected authorizationService: AuthorizationDataService,
    public dsoNameService: DSONameService,
  ) {
    super(objectSelectService, authorizationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'collection.select.confirm';
    }
  }

}
