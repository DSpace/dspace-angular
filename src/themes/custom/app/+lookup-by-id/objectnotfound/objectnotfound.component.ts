import { Component } from '@angular/core';
import { ObjectNotFoundComponent as BaseComponent } from '../../../../../app/+lookup-by-id/objectnotfound/objectnotfound.component';

@Component({
  selector: 'ds-objnotfound',
  // styleUrls: ['./objectnotfound.component.scss'],
  styleUrls: ['../../../../../app/+lookup-by-id/objectnotfound/objectnotfound.component.scss'],
  // templateUrl: './objectnotfound.component.html',
  templateUrl: '../../../../../app/+lookup-by-id/objectnotfound/objectnotfound.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class ObjectNotFoundComponent extends BaseComponent {}

