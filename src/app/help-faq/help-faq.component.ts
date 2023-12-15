import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-help-faq',
  templateUrl: './help-faq.component.html',
  styleUrls: ['./help-faq.component.scss']
})
export class HelpFaqComponent {
  panelOpenState = false;
  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
  }
}
