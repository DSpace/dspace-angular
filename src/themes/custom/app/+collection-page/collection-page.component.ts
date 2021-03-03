import { Component } from '@angular/core';
import { CollectionPageComponent as BaseComponent} from '../../../../app/+collection-page/collection-page.component';

/**
 * This component representing the `Forbidden` DSpace page.
 */
@Component({
  selector: 'ds-collection-page',
  // templateUrl: './collection-page.component.html',
  templateUrl: '../../../../app/+collection-page/collection-page.component.html',
  // styleUrls: ['./collection-page.component.scss']
  styleUrls: ['../../../../app/+collection-page/collection-page.component.scss']
})
/**
 * Component to render the news section on the home page
 */
export class CollectionPageComponent extends BaseComponent {}
