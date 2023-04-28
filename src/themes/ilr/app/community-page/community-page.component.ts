import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommunityPageComponent as BaseComponent} from '../../../../app/community-page/community-page.component';
import {fadeInOut} from '../../../../app/shared/animations/fade';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: 'ds-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['../../../../app/community-page/community-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent extends BaseComponent {
}
