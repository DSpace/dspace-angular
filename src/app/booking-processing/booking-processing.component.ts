
import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HeaderService } from '../commons/services/Header/header.service';
@Component({
  selector: 'app-booking-processing',
  templateUrl: './booking-processing.component.html',
  styleUrls: ['./booking-processing.component.scss']
})
export class BookingProcessingComponent {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 30;
  constructor(private headerService: HeaderService,
    private router: Router,) {
    
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.headerService.hide = false;
  }
  ngOnInit() {
    // do init at here for current route.

    setTimeout(() => {
        this.router.navigate(['/my-trips']);
    }, 5000);  //5s
  }

}
