import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LogOutComponent } from '../shared/log-out/log-out.component';

@Component({
    selector: 'ds-logout-page',
    styleUrls: ['./logout-page.component.scss'],
    templateUrl: './logout-page.component.html',
    standalone: true,
    imports: [LogOutComponent, TranslateModule]
})
export class LogoutPageComponent {

}
