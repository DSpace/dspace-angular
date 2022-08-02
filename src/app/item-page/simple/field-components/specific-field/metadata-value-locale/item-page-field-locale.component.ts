import { Component, Input } from '@angular/core';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { Item } from '../../../../../core/shared/item.model';


/**
 * This component can be used to represent metadata on a simple item page.
 * It expects one input parameter of type Item to which the metadata belongs.
 * This class can be extended to print certain metadata.
 */

@Component({
    selector: 'ds-item-page-field-locale',
    templateUrl: './item-page-field-locale.component.html'
})
export class ItemPageFieldLocaleComponent extends ItemPageFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    @Input() separator: string;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     */
    @Input() fields: string[];

    /**
     * Label i18n key for the rendered metadata
     */
    @Input() label: string;

    /**
    * The filtered metadata language
    */
    @Input() language: string;

}
