import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-content-accordion',
  templateUrl: './content-accordion.component.html',
  styleUrls: ['./content-accordion.component.scss']
})
export class ContentAccordionComponent {

  @Input() id: string;
  @Input() data: any;

}
