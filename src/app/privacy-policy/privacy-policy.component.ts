import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
  }
}
