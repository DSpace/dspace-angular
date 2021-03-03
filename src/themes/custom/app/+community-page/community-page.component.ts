import { Component } from '@angular/core';
import { CommunityPageComponent as BaseComponent} from '../../../../app/+community-page/community-page.component';

/**
 * This component representing the `Forbidden` DSpace page.
 */
@Component({
  selector: 'ds-community-page',
  // templateUrl: './community-page.component.html',
  templateUrl: '../../../../app/+community-page/community-page.component.html',
  // styleUrls: ['./community-page.component.scss']
  styleUrls: ['../../../../app/+community-page/community-page.component.scss']
})
/**
 * Component to render the news section on the home page
 */
export class CommunityPageComponent extends BaseComponent {}
