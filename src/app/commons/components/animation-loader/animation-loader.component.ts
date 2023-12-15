import { Component } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-animation-loader',
  templateUrl: './animation-loader.component.html',
  styleUrls: ['./animation-loader.component.scss']
})
export class AnimationLoaderComponent {
  options: AnimationOptions = {
    path: 'assets/lottie/shape-loader-icon.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
