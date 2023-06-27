import { Component } from '@angular/core';

import { RootComponent as BaseComponent } from '../../../../app/root/root.component';
import { slideSidebarPadding } from '../../../../app/shared/animations/slide';

@Component({
  selector: 'ds-root',
  // styleUrls: ['./root.component.scss'],
  styleUrls: ['../../../../app/root/root.component.scss'],
  // templateUrl: './root.component.html',
  templateUrl: '../../../../app/root/root.component.html',
  animations: [slideSidebarPadding],
})
export class RootComponent extends BaseComponent {

}
