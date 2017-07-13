import { Component } from '@angular/core';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent {

  dateObj: number = Date.now();

}
