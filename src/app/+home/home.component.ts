import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
