import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { HeaderService } from 'src/app/commons/services/Header/header.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = new FormControl('');
  loginForm: FormGroup
  submitted = false;
  constructor(private headerService: HeaderService,
    private authservice: AuthFacadeApiService,
    private fb:FormBuilder,private router: Router) {
    this.headerService.hide = true; // Hide the header in HomeComponent
    this.loginForm = this.fb.group({
      email: [''],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authservice.authForgotPasswordPost(this.loginForm.value).pipe().subscribe((response) => {
        Swal.fire({
          title: "Mail Sent",
          text: "Reset password mail has been sent",
          icon: "success"
        });
        this.router.navigate(['/login']);
      });
    }
    
  }

  back(){
    
    this.router.navigate(['/home']).then(() => {
      location.reload();
    });
  }
}
