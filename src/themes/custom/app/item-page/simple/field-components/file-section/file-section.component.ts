import { Component } from '@angular/core';

import { FileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';

@Component({
  selector: 'ds-item-page-file-section',
  // templateUrl: './file-section.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component.html',
  animations: [slideSidebarPadding],
})
export class FileSectionComponent extends BaseComponent {

}
