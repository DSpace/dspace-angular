import { Component , } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { HeaderService } from '../commons/services/Header/header.service';

@Component({
  selector: 'app-generating-itinerary',
  templateUrl: './generating-itinerary.component.html',
  styleUrls: ['./generating-itinerary.component.scss']
})
export class GeneratingItineraryComponent  {

  options_03: AnimationOptions = {
    path: 'assets/lottie/places-loader.json',
    autoplay: true,
    loop: true,
  };
  
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  constructor(private headerService: HeaderService,private router: Router) {
    this.headerService.showHeader = false; 
    this.headerService.hide = true; 
  }
  ngOnInit() {
    // do init at here for current route.

    setTimeout(() => {
        this.router.navigate(['/trip-details/0']);
    }, 5000);  //5s
  }

}
