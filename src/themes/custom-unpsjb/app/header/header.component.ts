import { Component } from '@angular/core';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  // styleUrls: ['header.component.scss'],
  styleUrls: ['../../../../app/header/header.component.scss'],
  
  // Descomento the templateUrl which references the "header.component.html" file in your theme directory
  templateUrl: 'header.component.html',
  // Comento out the templateUrl which references the default "src/app/header/header.component.html" file.
  //templateUrl: '../../../../app/header/header.component.html',

})
export class HeaderComponent extends BaseComponent {
}
