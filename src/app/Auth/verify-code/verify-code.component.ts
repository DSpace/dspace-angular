import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { HeaderService } from 'src/app/commons/services/Header/header.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
animationCreated($event: AnimationItem) {
throw new Error('Method not implemented.');
}
  constructor(private headerService: HeaderService,
    private authFacadeService: AuthFacadeApiService,
    private route: ActivatedRoute) {
    this.headerService.hide = true; // Hide the header in Component
  }
  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('id');
    this.authFacadeService.authVerifyUserVerificationCodeGet(token).pipe().subscribe((response) =>{
      console.log(response);
    });
  }
  options_03: AnimationOptions = {
    path: 'assets/lottie/done-v.json',
    autoplay: true,
    loop: false,
  };
  
}
