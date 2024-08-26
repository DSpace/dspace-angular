import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-confirmation-sent',
  templateUrl: './confirmation-sent.component.html',
  styleUrls: ['./confirmation-sent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class ConfirmationSentComponent { }
