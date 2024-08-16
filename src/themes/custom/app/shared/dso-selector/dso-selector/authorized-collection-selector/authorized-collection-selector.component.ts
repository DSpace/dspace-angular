import { Component } from '@angular/core';
import { AuthorizedCollectionSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';

@Component({
  selector: 'ds-authorized-collection-selector',
  // styleUrls: ['./authorized-collection-selector.component.scss'],
  styleUrls: ['../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.scss'],
  // templateUrl: './authorized-collection-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.html',
})
export class AuthorizedCollectionSelectorComponent extends BaseComponent {
}
