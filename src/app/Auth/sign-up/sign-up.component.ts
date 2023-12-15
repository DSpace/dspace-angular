import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { HeaderService } from 'src/app/commons/services/Header/header.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean = undefined;
  submitted = false;
  constructor(private headerService: HeaderService,
    private authservice: AuthFacadeApiService,
    private fb: FormBuilder,
    private socialAuthService: SocialAuthService,private route: Router) {
    this.headerService.hide = true; 
  
    
  }

   ngOnInit() {
    this.createfrom();

   }

   createfrom(){
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

   }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authservice.authRegisterPost(this.registerForm.value).pipe().subscribe((response) => {
        if (response.status === 1 && response.message === 'Registration success') {
          Swal.fire({
            title: "Mail Sent",
            text: "Verification mail has been sent",
            icon: "success"
          });
          this.route.navigate(['/login']).then(() => {
            location.reload();
          });
        }
        else{
          Swal.fire({
            title: "Email",
            text: "Email Already Exists!",
            icon: "error"
          });
        }
      });
    }
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);

    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      this.socialUser = user;
      this.isLoggedin = user != null;
    });
  }


}
