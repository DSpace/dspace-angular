import { Component } from '@angular/core';

import { Bundle } from '../../../core/shared/bundle.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-bundle-list-element',
  templateUrl: './bundle-list-element.component.html',
  standalone: true,
})
/**
 * This component is automatically used to create a list view for Bundle objects
 */
@listableObjectComponent(Bundle, ViewMode.ListElement)
export class BundleListElementComponent extends AbstractListableElementComponent<Bundle> {
}
