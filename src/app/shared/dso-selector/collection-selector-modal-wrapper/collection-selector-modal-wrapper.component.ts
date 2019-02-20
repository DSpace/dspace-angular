import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-collection-selector-modal-wrapper',
  // styleUrls: ['./collection-selector.component.scss'],
  templateUrl: './collection-selector-modal-wrapper.component.html',
})
export class CollectionSelectorModalWrapperComponent {
    @Input() currentCollectionID: string;
}
