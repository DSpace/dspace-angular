import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss']
})
export class PopularDestinationsComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
  }
}
