import {ChangeDetectionStrategy, Component} from '@angular/core';
import {fadeInOut} from '../../../../app/shared/animations/fade';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: 'ds-readership-map',
    templateUrl: './readership-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOut]
})
export class ReadershipMapComponent {

    constructor(private sanitizer: DomSanitizer) {
    }

    safeUrl() {
        let trusted = this.sanitizer.bypassSecurityTrustResourceUrl("https://readership-maps.ecommons.cornell.edu/map.html");
        return trusted;
    }

}
