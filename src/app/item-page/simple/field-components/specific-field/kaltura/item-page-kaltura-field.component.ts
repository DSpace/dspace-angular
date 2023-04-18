import {Component, Input} from '@angular/core';

import {Item} from '../../../../../core/shared/item.model';
import {DSONameService} from '../../../../../core/breadcrumbs/dso-name.service';

import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'ds-item-page-kaltura-field',
    templateUrl: './item-page-kaltura-field.component.html'
})
/**
 * This component is used for displaying the title (defined by the {@link DSONameService}) of an item
 */
export class ItemPageKalturaFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    constructor(
        public dsoNameService: DSONameService,
        public sanitizer: DomSanitizer
    ) {

    }

    safeUrl(id: string) {
        let untrusted = 'https://cdnapisec.kaltura.com/p/518251/embedPlaykitJs/uiconf_id/52424842?iframeembed=true&entry_id=' + id;
        let trusted = this.sanitizer.bypassSecurityTrustResourceUrl(untrusted);
        return trusted;
    }

}
