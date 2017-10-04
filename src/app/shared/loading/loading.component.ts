import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-loading',
  styleUrls: ['./loading.component.scss'],
  templateUrl: './loading.component.html'
})
export class LoadingComponent {

  @Input() message: 'Loading...';

}
