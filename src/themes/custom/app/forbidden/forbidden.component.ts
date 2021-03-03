import { Component } from '@angular/core';
import { ForbiddenComponent as BaseComponent } from '../../../../app/forbidden/forbidden.component';

/**
 * This component representing the `Forbidden` DSpace page.
 */
@Component({
  selector: 'ds-forbidden',
  // templateUrl: './forbidden.component.html',
  templateUrl: '../../../../app/forbidden/forbidden.component.html',
  // styleUrls: ['./forbidden.component.scss']
  styleUrls: ['../../../../app/forbidden/forbidden.component.scss']
})
/**
 * Component to render the news section on the home page
 */
export class ForbiddenComponent extends BaseComponent {}
